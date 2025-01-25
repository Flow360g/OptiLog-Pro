import jsPDF from "jspdf";
import { Test } from "../../types";
import { supabase } from "@/integrations/supabase/client";
import { addLogoToDocument } from "./components/logoHandler";
import { drawGridAndLabels } from "./components/gridGenerator";
import { renderTasks } from "./components/taskRenderer";
import { addTitle } from "./components/titleHandler";
import { calculateChartDimensions, prepareChartData } from "./components/chartCalculator";
import { PDFConfig } from "./types/pdf";

const generateGanttChart = async (
  doc: jsPDF,
  tests: Test[],
  startY: number = 50,
  userId: string,
  clientName: string
): Promise<number> => {
  // Get user's brand settings
  const { data: profile } = await supabase
    .from('profiles')
    .select('secondary_color')
    .eq('id', userId)
    .single();

  // Prepare chart data
  const { tasks, minDate, maxDate } = prepareChartData(tests);
  
  if (tasks.length === 0) {
    doc.setFontSize(12);
    doc.text("No tests with dates available", 20, startY);
    return startY + 20;
  }

  // Add logo and get new Y position
  const { newY } = await addLogoToDocument(doc, null, supabase, doc.internal.pageSize.width, startY);
  
  // Add title
  const pageWidth = doc.internal.pageSize.width;
  const newTitleY = addTitle(doc, clientName, newY + 30, pageWidth, "Testing Schedule");

  // Calculate chart dimensions
  const { dimensions, chartStartY } = calculateChartDimensions(doc, tasks, newTitleY);
  
  // Update dayWidth based on date range
  dimensions.dayWidth = dimensions.chartWidth / 
    Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));

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