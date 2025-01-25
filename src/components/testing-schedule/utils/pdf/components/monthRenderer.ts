import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { ChartDimensions, MonthPosition } from "../types/gantt";

export const renderMonth = (
  doc: jsPDF,
  month: { start: Date; end: Date; weeks: number },
  currentX: number,
  startY: number,
  monthWidth: number,
  secondaryColor?: string | null
): void => {
  // Draw month background and border
  const bgColor = secondaryColor || "#f1f5f9";
  doc.setFillColor(bgColor);
  doc.rect(currentX, startY - 45, monthWidth, 30, "F");
  
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.rect(currentX, startY - 45, monthWidth, 30);
  
  // Set consistent month label formatting
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(format(month.start, "MMMM yyyy"), currentX + 10, startY - 25);
};