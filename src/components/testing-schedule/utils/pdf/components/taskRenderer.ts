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
    const barHeight = dimensions.rowHeight * 0.8;
    const barY = y + (dimensions.rowHeight - barHeight) / 2;

    // Draw task name aligned to the right of the text area - removed bold font
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(
      task.name.substring(0, 30) + (task.name.length > 30 ? "..." : ""),
      dimensions.chartStartX - 10,
      y + dimensions.rowHeight / 2,
      { align: 'right' }
    );

    // Calculate exact start and end positions based on dates
    const taskStartX = dimensions.chartStartX +
      (task.startDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24) * dimensions.dayWidth;
    
    const taskWidth = Math.max(
      ((task.endDate.getTime() - task.startDate.getTime()) / (1000 * 60 * 60 * 24)) * dimensions.dayWidth,
      dimensions.dayWidth // Ensure minimum width of one day
    );

    // Draw task bar
    doc.setFillColor(CHART_COLORS[task.status as keyof typeof CHART_COLORS]);
    doc.rect(taskStartX, barY, taskWidth, barHeight, "F");
  });

  return startY + tasks.length * dimensions.rowHeight + 20;
};