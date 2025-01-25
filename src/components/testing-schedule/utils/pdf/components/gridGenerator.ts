import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { ChartDimensions, MonthPosition } from "../types/gantt";

export const drawGridAndLabels = (
  doc: jsPDF,
  startY: number,
  minDate: Date,
  maxDate: Date,
  dimensions: ChartDimensions,
  tasksLength: number,
  secondaryColor?: string | null
): { monthPositions: MonthPosition[]; newStartY: number } => {
  const monthPositions: MonthPosition[] = [];
  let currentDate = new Date(minDate);

  // Add padding to chart
  const horizontalPadding = 20;
  const adjustedChartStartX = dimensions.chartStartX + horizontalPadding;
  const adjustedChartWidth = dimensions.chartWidth - (horizontalPadding * 2);

  // First, let's draw the months - simple and clear
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  
  while (currentDate <= maxDate) {
    const x = adjustedChartStartX + 
      (currentDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24) * dimensions.dayWidth;
    
    // Only add month label at the start of each month
    if (currentDate.getDate() === 1 || currentDate.getTime() === minDate.getTime()) {
      const monthLabel = format(currentDate, "MMMM yyyy");
      
      // Draw background for month label using secondary color or default
      const bgColor = secondaryColor || "#f1f5f9"; // Default to a light slate color
      doc.setFillColor(bgColor);
      doc.rect(x, startY - 35, 
        dimensions.dayWidth * 31, // Approximate month width
        20, "F");
      
      // Draw month text
      doc.setTextColor(0, 0, 0);
      doc.text(monthLabel, x + 5, startY - 25);
      
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
  
  // Draw week numbers with background
  while (currentDate <= maxDate) {
    const x = adjustedChartStartX + 
      (currentDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24) * dimensions.dayWidth;
    
    // Draw week number background
    const bgColor = secondaryColor || "#f1f5f9";
    doc.setFillColor(bgColor);
    doc.rect(x, startY - 15, 
      dimensions.dayWidth * 7, // Week width
      12, "F");
    
    // Draw week number text
    doc.setTextColor(0, 0, 0);
    doc.text(`W${weekNumber}`, x + 5, startY - 10);
    
    weekNumber = weekNumber % 4 + 1;
    currentDate.setDate(currentDate.getDate() + 7);
  }

  // Draw vertical grid lines
  currentDate = new Date(minDate);
  while (currentDate <= maxDate) {
    const x = adjustedChartStartX +
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
    doc.line(adjustedChartStartX, y, adjustedChartStartX + adjustedChartWidth, y);
  }

  return { monthPositions, newStartY: startY };
};