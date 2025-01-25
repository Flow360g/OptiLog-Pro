import { jsPDF } from "jspdf";
import { GanttTask, ChartDimensions, CHART_COLORS } from "../types/gantt";

export const renderTasks = (
  doc: jsPDF,
  tasks: GanttTask[],
  startY: number,
  minDate: Date,
  dimensions: ChartDimensions
): number => {
  tasks.forEach((task, index) => {
    const y = startY + index * dimensions.rowHeight;
    const barHeight = dimensions.rowHeight * 0.8; // Keep height at 80% of row height
    const barY = y + (dimensions.rowHeight - barHeight) / 2; // Center the bar vertically

    // Draw task name aligned to the right of the text area
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(
      task.name.substring(0, 30) + (task.name.length > 30 ? "..." : ""),
      dimensions.chartStartX - 10,
      y + dimensions.rowHeight / 2,
      { align: 'right' }
    );

    // Draw task bar
    const taskStartX =
      dimensions.chartStartX +
      (task.startDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24) * dimensions.dayWidth;
    const taskWidth =
      ((task.endDate.getTime() - task.startDate.getTime()) / (1000 * 60 * 60 * 24)) *
      dimensions.dayWidth;

    doc.setFillColor(CHART_COLORS[task.status as keyof typeof CHART_COLORS]);
    doc.rect(taskStartX, barY, taskWidth, barHeight, "F");
  });

  return startY + tasks.length * dimensions.rowHeight + 20;
};