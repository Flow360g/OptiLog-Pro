import jsPDF from "jspdf";
import { Test } from "../../types";
import { supabase } from "@/integrations/supabase/client";
import { GanttTask, ChartDimensions } from "./types/gantt";
import { addLogoToDocument } from "./components/logoHandler";
import { drawGridAndLabels } from "./components/gridGenerator";
import { renderTasks } from "./components/taskRenderer";

const generateGanttChart = async (
  doc: jsPDF,
  tests: Test[],
  startY: number = 50,
  userId: string,
  clientName: string
): Promise<number> => {
  // Filter out tests without dates
  const tasksWithDates = tests.filter(
    (test): test is Test & { start_date: string; end_date: string } =>
      test.start_date !== null && test.end_date !== null
  );

  if (tasksWithDates.length === 0) {
    doc.setFontSize(12);
    doc.text("No tests with dates available", 20, startY);
    return startY + 20;
  }

  // Get user's brand settings
  const { data: profile } = await supabase
    .from('profiles')
    .select('secondary_color')
    .eq('id', userId)
    .single();

  // Convert tests to GanttTask format
  const tasks: GanttTask[] = tasksWithDates.map((test) => ({
    name: test.name,
    startDate: new Date(test.start_date),
    endDate: new Date(test.end_date),
    status: test.status,
  }));

  // Find date range
  const allDates = tasks.flatMap((task) => [task.startDate, task.endDate]);
  const minDate = new Date(Math.min(...allDates.map((d) => d.getTime())));
  const maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())));

  // Calculate the longest task name to determine left padding
  const maxTaskNameLength = Math.max(...tasks.map(task => task.name.length));
  const taskNameWidth = maxTaskNameLength * 5; // Approximate width per character
  const leftPadding = taskNameWidth + 30; // Add some extra padding

  // Chart dimensions - centered on page
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const chartWidth = pageWidth - leftPadding - 50; // Account for left text and right padding
  const chartStartX = leftPadding; // Start chart after task names

  const dimensions: ChartDimensions = {
    chartStartX,
    chartWidth,
    rowHeight: 40, // Keep increased row height
    dayWidth: chartWidth / 
      Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24))
  };

  // Add logo and get new Y position
  const logoEndY = await addLogoToDocument(doc, userId);
  
  // Add combined title below logo with padding
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold"); // Set font to bold for the title
  const titleY = logoEndY + 30;
  doc.text(
    `${clientName.toUpperCase()} - Testing Schedule`,
    pageWidth / 2,
    titleY,
    { align: "center" }
  );
  doc.setFont("helvetica", "normal"); // Reset font back to normal for the rest of the document

  // Center chart vertically
  const chartHeight = tasks.length * dimensions.rowHeight + 100;
  const availableSpace = pageHeight - (titleY + 50);
  const chartStartY = titleY + 50 + (availableSpace - chartHeight) / 2;

  // Draw grid and labels with secondary color
  const { newStartY } = drawGridAndLabels(
    doc,
    chartStartY,
    minDate,
    maxDate,
    dimensions,
    tasks.length,
    profile?.secondary_color
  );

  // Render tasks
  return renderTasks(doc, tasks, newStartY, minDate, dimensions);
};

export const generateGanttPDF = async (tests: Test[], clientName: string) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "pt",
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("No user found");
  }

  // Generate Gantt chart with user ID and client name
  await generateGanttChart(doc, tests, 80, user.id, clientName);

  // Save the PDF
  doc.save(`${clientName}_testing_schedule.pdf`);
};