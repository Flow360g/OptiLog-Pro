import { jsPDF } from "jspdf";
import { format, endOfMonth, startOfMonth, differenceInDays } from "date-fns";
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

  // Calculate month boundaries
  const months: { start: Date; end: Date; weeks: number }[] = [];
  let tempDate = new Date(minDate);
  
  while (tempDate <= maxDate) {
    const monthStart = startOfMonth(tempDate);
    const monthEnd = endOfMonth(tempDate);
    const daysInMonth = differenceInDays(monthEnd, monthStart) + 1;
    months.push({
      start: monthStart,
      end: monthEnd,
      weeks: Math.ceil(daysInMonth / 7)
    });
    tempDate = new Date(tempDate.getFullYear(), tempDate.getMonth() + 1, 1);
  }

  // Calculate total weeks for width adjustment
  const totalWeeks = months.reduce((acc, month) => acc + month.weeks, 0);
  const weekWidth = dimensions.chartWidth / totalWeeks;
  dimensions.dayWidth = weekWidth / 7; // Update dayWidth to maintain proportions

  // Draw months
  doc.setFontSize(12);
  
  let currentX = dimensions.chartStartX;
  months.forEach(month => {
    const monthWidth = month.weeks * weekWidth;
    
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
    
    monthPositions.push({
      month: format(month.start, "MMMM yyyy"),
      x: currentX
    });

    // Draw weeks for this month
    let weekX = currentX;
    for (let week = 1; week <= month.weeks; week++) {
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
      doc.text(`W${week}`, weekX + 5, startY - 5);
      
      // Draw vertical grid line
      doc.setDrawColor(220);
      doc.setLineWidth(0.2);
      doc.line(weekX, startY, weekX, startY + tasksLength * dimensions.rowHeight);
      
      weekX += weekWidth;
    }
    
    currentX += monthWidth;
  });

  // Draw right border of the chart
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(currentX, startY - 45, currentX, startY + tasksLength * dimensions.rowHeight);

  // Draw left border of the chart
  doc.line(dimensions.chartStartX, startY - 45, dimensions.chartStartX, startY + tasksLength * dimensions.rowHeight);

  // Draw horizontal grid lines
  for (let i = 0; i <= tasksLength; i++) {
    const y = startY + i * dimensions.rowHeight;
    doc.setDrawColor(i === tasksLength ? 0 : 220);
    doc.setLineWidth(i === tasksLength ? 0.5 : 0.2);
    doc.line(dimensions.chartStartX, y, currentX, y);
  }

  return { monthPositions, newStartY: startY };
};