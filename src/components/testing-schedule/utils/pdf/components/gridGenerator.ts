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

  // Draw month labels with more emphasis and proper spacing
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  monthPositions.forEach((month, index) => {
    const nextMonth = monthPositions[index + 1];
    const monthWidth = nextMonth 
      ? nextMonth.x - month.x 
      : dimensions.chartWidth - (month.x - dimensions.chartStartX);
    
    // Draw month name centered above its section
    doc.text(
      month.month,
      month.x + monthWidth / 2,
      startY - 40,
      { align: "center" }
    );
  });
  doc.setFont(undefined, 'normal');

  // Reset current date for week numbers
  currentDate = new Date(minDate);
  
  // Draw week numbers with proper spacing below months
  doc.setFontSize(10);
  while (currentDate <= maxDate) {
    const x = dimensions.chartStartX + 
      (currentDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24) * dimensions.dayWidth;
    
    doc.text(`W${weekNumber}`, x, startY - 20, { align: "center" });
    
    weekNumber = weekNumber % 4 + 1;
    currentDate.setDate(currentDate.getDate() + 7);
  }

  // Draw vertical grid lines
  currentDate = new Date(minDate);
  while (currentDate <= maxDate) {
    const x = dimensions.chartStartX +
      (currentDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24) * dimensions.dayWidth;
    
    // Make month dividers darker than week dividers
    const isMonthStart = currentDate.getDate() === 1;
    doc.setDrawColor(isMonthStart ? 100 : 220);
    doc.setLineWidth(isMonthStart ? 0.5 : 0.2);
    doc.line(x, startY, x, startY + tasksLength * dimensions.rowHeight);
    
    currentDate.setDate(currentDate.getDate() + 7);
  }

  // Draw horizontal grid lines
  doc.setDrawColor(220);
  doc.setLineWidth(0.2);
  for (let i = 0; i <= tasksLength; i++) {
    const y = startY + i * dimensions.rowHeight;
    doc.line(dimensions.chartStartX, y, dimensions.chartStartX + dimensions.chartWidth, y);
  }

  return { monthPositions, newStartY: startY };
};