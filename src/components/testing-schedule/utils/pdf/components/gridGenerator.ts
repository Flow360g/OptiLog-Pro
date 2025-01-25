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
  const horizontalPadding = 30; // Increased padding
  const adjustedChartStartX = dimensions.chartStartX + horizontalPadding;
  const adjustedChartWidth = dimensions.chartWidth - (horizontalPadding * 2);

  // Calculate total days for width adjustment
  const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
  const exactChartWidth = totalDays * dimensions.dayWidth;

  // First, let's draw the months - simple and clear
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  
  while (currentDate <= maxDate) {
    const x = adjustedChartStartX + 
      (currentDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24) * dimensions.dayWidth;
    
    // Only add month label at the start of each month
    if (currentDate.getDate() === 1 || currentDate.getTime() === minDate.getTime()) {
      const monthLabel = format(currentDate, "MMMM yyyy");
      
      // Calculate width for this month (number of days * dayWidth)
      const daysInMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      ).getDate();
      const monthWidth = Math.min(
        daysInMonth * dimensions.dayWidth,
        exactChartWidth - (x - adjustedChartStartX)
      );
      
      // Draw background for month label using secondary color or default
      const bgColor = secondaryColor || "#f1f5f9";
      doc.setFillColor(bgColor);
      doc.rect(x, startY - 40, monthWidth, 25, "F"); // Increased height and adjusted Y position
      
      // Draw border around month label
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.rect(x, startY - 40, monthWidth, 25); // Match the background rectangle
      
      // Draw month text with padding
      doc.setTextColor(0, 0, 0);
      doc.text(monthLabel, x + 5, startY - 25); // Adjusted Y position for text
      
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
  
  // Draw week numbers with background and borders
  while (currentDate <= maxDate) {
    const x = adjustedChartStartX + 
      (currentDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24) * dimensions.dayWidth;
    
    // Calculate week width (7 days * dayWidth)
    const weekWidth = Math.min(
      7 * dimensions.dayWidth,
      exactChartWidth - (x - adjustedChartStartX)
    );
    
    // Draw week number background
    const bgColor = secondaryColor || "#f1f5f9";
    doc.setFillColor(bgColor);
    doc.rect(x, startY - 15, weekWidth, 15, "F"); // Increased height
    
    // Draw border around week number
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.rect(x, startY - 15, weekWidth, 15); // Match the background rectangle
    
    // Draw week number text with padding
    doc.setTextColor(0, 0, 0);
    doc.text(`W${weekNumber}`, x + 5, startY - 5);
    
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
    doc.line(adjustedChartStartX, y, adjustedChartStartX + exactChartWidth, y);
  }

  return { monthPositions, newStartY: startY };
};