import { jsPDF } from "jspdf";

export const renderWeek = (
  doc: jsPDF,
  weekX: number,
  startY: number,
  weekWidth: number,
  weekNumber: number,
  tasksLength: number,
  bgColor: string
): void => {
  // Draw week background
  doc.setFillColor(bgColor);
  doc.rect(weekX, startY - 15, weekWidth, 15, "F");
  
  // Draw week border
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.rect(weekX, startY - 15, weekWidth, 15);
  
  // Draw week number with reduced font size
  doc.setFont(undefined, 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(0, 0, 0);
  doc.text(`W${weekNumber}`, weekX + 5, startY - 5);
  
  // Draw vertical grid line
  doc.setDrawColor(220);
  doc.setLineWidth(0.2);
  doc.line(weekX, startY, weekX, startY + tasksLength * 30);
};