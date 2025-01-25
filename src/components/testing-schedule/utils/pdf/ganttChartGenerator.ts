import jsPDF from "jspdf";
import { Test } from "../../types";
import { format } from "date-fns";

interface GanttTask {
  name: string;
  startDate: Date;
  endDate: Date;
  status: string;
}

const CHART_COLORS = {
  draft: "#94a3b8", // gray
  in_progress: "#3b82f6", // blue
  completed: "#22c55e", // green
  cancelled: "#ef4444", // red
};

const generateGanttChart = async (
  doc: jsPDF,
  tests: Test[],
  startY: number = 50
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
  const chartStartX = 150; // Space for task names
  const chartWidth = doc.internal.pageSize.width - chartStartX - 20;
  const rowHeight = 20;
  const totalDays = Math.ceil(
    (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const dayWidth = chartWidth / totalDays;

  // Draw header
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);

  // Draw month labels
  let currentDate = new Date(minDate);
  while (currentDate <= maxDate) {
    const x =
      chartStartX +
      (currentDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24) * dayWidth;
    doc.text(format(currentDate, "MMM yyyy"), x, startY);
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  startY += 20;

  // Draw tasks
  tasks.forEach((task, index) => {
    const y = startY + index * rowHeight;

    // Draw task name
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(task.name.substring(0, 30) + (task.name.length > 30 ? "..." : ""), 20, y + 5);

    // Draw task bar
    const taskStartX =
      chartStartX +
      (task.startDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24) * dayWidth;
    const taskWidth =
      ((task.endDate.getTime() - task.startDate.getTime()) / (1000 * 60 * 60 * 24)) *
      dayWidth;

    doc.setFillColor(CHART_COLORS[task.status as keyof typeof CHART_COLORS]);
    doc.rect(taskStartX, y, taskWidth, rowHeight - 5, "F");
  });

  // Draw vertical grid lines for months
  doc.setDrawColor(200, 200, 200);
  currentDate = new Date(minDate);
  while (currentDate <= maxDate) {
    const x =
      chartStartX +
      (currentDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24) * dayWidth;
    doc.line(x, startY - 15, x, startY + tasks.length * rowHeight);
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return startY + tasks.length * rowHeight + 20;
};

export const generateGanttPDF = async (tests: Test[], clientName: string) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "pt",
  });

  // Add title
  doc.setFontSize(20);
  doc.text(`${clientName.toUpperCase()} - Testing Schedule`, 20, 30);

  // Generate Gantt chart
  await generateGanttChart(doc, tests, 50);

  // Save the PDF
  doc.save(`${clientName}_testing_schedule.pdf`);
};