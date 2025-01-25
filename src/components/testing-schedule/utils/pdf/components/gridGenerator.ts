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

  // First, let's draw the months - simple and clear
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  
  while (currentDate <= maxDate) {
    const x = dimensions.chartStartX + 
      (currentDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24) * dimensions.dayWidth;
    
    // Only add month label at the start of each month
    if (currentDate.getDate() === 1 || currentDate.getTime() === minDate.getTime()) {
      const monthLabel = format(currentDate, "MMMM yyyy");
      doc.text(monthLabel, x, startY - 25, { align: "left" });
      
      monthPositions.push({
        month: monthLabel,
        x
      });
    }
    
    // Move to next day
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + 1);
    currentDate = nextDate;
  }
  
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);

  // Reset for week numbers
  currentDate = new Date(minDate);
  let weekNumber = 1;
  
  // Draw week numbers
  while (currentDate <= maxDate) {
    const x = dimensions.chartStartX + 
      (currentDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24) * dimensions.dayWidth;
    
    doc.text(`W${weekNumber}`, x, startY - 10, { align: "center" });
    
    weekNumber = weekNumber % 4 + 1;
    currentDate.setDate(currentDate.getDate() + 7);
  }

  // Draw vertical grid lines
  currentDate = new Date(minDate);
  while (currentDate <= maxDate) {
    const x = dimensions.chartStartX +
      (currentDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24) * dimensions.dayWidth;
    
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