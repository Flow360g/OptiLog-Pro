import { jsPDF } from "jspdf";
import { ChartDimensions } from "../types/gantt";

export const drawGridBorders = (
  doc: jsPDF,
  dimensions: ChartDimensions,
  startY: number,
  endX: number,
  tasksLength: number
): void => {
  // Draw right border
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(endX, startY - 45, endX, startY + tasksLength * dimensions.rowHeight);

  // Draw left border
  doc.line(
    dimensions.chartStartX,
    startY - 45,
    dimensions.chartStartX,
    startY + tasksLength * dimensions.rowHeight
  );

  // Draw horizontal grid lines
  for (let i = 0; i <= tasksLength; i++) {
    const y = startY + i * dimensions.rowHeight;
    doc.setDrawColor(i === tasksLength ? 0 : 220);
    doc.setLineWidth(i === tasksLength ? 0.5 : 0.2);
    doc.line(dimensions.chartStartX, y, endX, y);
  }
};