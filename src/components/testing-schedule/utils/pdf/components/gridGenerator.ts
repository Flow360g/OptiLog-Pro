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

  // Calculate total days and weeks for width adjustment
  const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.ceil(totalDays / 7);
  
  // Calculate week width to ensure it fits within the chart
  const weekWidth = dimensions.chartWidth / totalWeeks;
  dimensions.dayWidth = weekWidth / 7; // Update dayWidth to maintain proportions
  
  const exactChartWidth = totalWeeks * weekWidth;

  // First, let's draw the months - simple and clear
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  
  while (currentDate <= maxDate) {
    const x = dimensions.chartStartX + 
      (currentDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24) * dimensions.dayWidth;
    
    // Only add month label at the start of each month
    if (currentDate.getDate() === 1 || currentDate.getTime() === minDate.getTime()) {
      const monthLabel = format(currentDate, "MMMM yyyy");
      
      // Calculate width for this month
      const daysInMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      ).getDate();
      const monthWidth = Math.min(
        daysInMonth * dimensions.dayWidth,
        exactChartWidth - (x - dimensions.chartStartX)
      );
      
      // Draw background for month label
      const bgColor = secondaryColor || "#f1f5f9";
      doc.setFillColor(bgColor);
      doc.rect(x, startY - 45, monthWidth, 30, "F");
      
      // Draw border around month label
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.rect(x, startY - 45, monthWidth, 30);
      
      // Draw month text with padding
      doc.setTextColor(0, 0, 0);
      doc.text(monthLabel, x + 10, startY - 25);
      
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
  
  // Draw week numbers with consistent width
  while (currentDate <= maxDate) {
    const x = dimensions.chartStartX + 
      (currentDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24) * dimensions.dayWidth;
    
    // Draw week number background
    const bgColor = secondaryColor || "#f1f5f9";
    doc.setFillColor(bgColor);
    doc.rect(x, startY - 15, weekWidth, 15, "F");
    
    // Draw border around week number
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.rect(x, startY - 15, weekWidth, 15);
    
    // Draw week number text with padding
    doc.setTextColor(0, 0, 0);
    doc.text(`W${weekNumber}`, x + 5, startY - 5);
    
    weekNumber = weekNumber % 4 + 1;
    
    // Move to next week
    currentDate.setDate(currentDate.getDate() + 7);
  }

  // Draw vertical grid lines for weeks
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
    doc.line(dimensions.chartStartX, y, dimensions.chartStartX + exactChartWidth, y);
  }

  return { monthPositions, newStartY: startY };
};