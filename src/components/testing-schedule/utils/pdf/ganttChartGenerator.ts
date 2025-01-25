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
  userId: string
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

  // Chart dimensions
  const dimensions: ChartDimensions = {
    chartStartX: 150,
    chartWidth: doc.internal.pageSize.width - 150 - 40,
    rowHeight: 20,
    dayWidth: (doc.internal.pageSize.width - 150 - 40) / 
      Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24))
  };

  // Add logo and get new Y position
  startY = await addLogoToDocument(doc, userId);

  // Draw grid and labels
  const { newStartY } = drawGridAndLabels(
    doc,
    startY,
    minDate,
    maxDate,
    dimensions,
    tasks.length
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

  // Add centered title below logo
  doc.setFontSize(20);
  doc.text(
    `${clientName.toUpperCase()} - Testing Schedule`,
    doc.internal.pageSize.width / 2,
    30,
    { align: "center" }
  );

  // Generate Gantt chart with user ID
  await generateGanttChart(doc, tests, 80, user.id);

  // Save the PDF
  doc.save(`${clientName}_testing_schedule.pdf`);
};