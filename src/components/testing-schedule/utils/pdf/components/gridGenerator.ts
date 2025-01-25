import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { ChartDimensions, MonthPosition } from "../types/gantt";

export const drawGridAndLabels = (
  doc: jsPDF,
  startY: number,
  minDate: Date,
  maxDate: Date,
  dimensions: ChartDimensions,
  tasksLength: number
): { monthPositions: MonthPosition[]; newStartY: number } => {
  const monthPositions: MonthPosition[] = [];
  let currentDate = new Date(minDate);
  let weekNumber = 1;

  // First pass: collect month positions
  while (currentDate <= maxDate) {
    const x = dimensions.chartStartX + 
      (currentDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24) * dimensions.dayWidth;
    
    if (currentDate.getDate() === 1 || currentDate === minDate) {
      monthPositions.push({
        month: format(currentDate, "MMMM yyyy"),
        x
      });
    }
    
    currentDate.setDate(currentDate.getDate() + 7);
  }

  // Draw month labels first (40px above week numbers)
  doc.setFontSize(12);
  monthPositions.forEach((month, index) => {
    const nextMonth = monthPositions[index + 1];
    const monthWidth = nextMonth 
      ? nextMonth.x - month.x 
      : dimensions.chartWidth - (month.x - dimensions.chartStartX);
    doc.text(month.month, month.x + monthWidth / 2, startY - 40, { align: "center" });
  });

  // Reset current date for week numbers
  currentDate = new Date(minDate);
  
  // Draw week numbers
  doc.setFontSize(10);
  while (currentDate <= maxDate) {
    const x = dimensions.chartStartX + 
      (currentDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24) * dimensions.dayWidth;
    
    doc.text(`W${weekNumber}`, x, startY - 20, { align: "center" });
    
    weekNumber = weekNumber % 4 + 1;
    currentDate.setDate(currentDate.getDate() + 7);
  }

  // Draw grid lines
  currentDate = new Date(minDate);
  while (currentDate <= maxDate) {
    const x = dimensions.chartStartX +
      (currentDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24) * dimensions.dayWidth;
    
    doc.setDrawColor(currentDate.getDate() === 1 ? 150 : 220);
    doc.line(x, startY, x, startY + tasksLength * dimensions.rowHeight);
    
    currentDate.setDate(currentDate.getDate() + 7);
  }

  // Draw horizontal grid lines
  doc.setDrawColor(220, 220, 220);
  for (let i = 0; i <= tasksLength; i++) {
    const y = startY + i * dimensions.rowHeight;
    doc.line(dimensions.chartStartX, y, dimensions.chartStartX + dimensions.chartWidth, y);
  }

  return { monthPositions, newStartY: startY };
};