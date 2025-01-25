import { jsPDF } from "jspdf";
import { endOfMonth, startOfMonth, differenceInDays, format } from "date-fns";
import { ChartDimensions, MonthPosition } from "../types/gantt";
import { renderMonth } from "./monthRenderer";
import { renderWeek } from "./weekRenderer";
import { drawGridBorders } from "./gridBorders";

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
  dimensions.dayWidth = weekWidth / 7;

  let currentX = dimensions.chartStartX;
  months.forEach(month => {
    const monthWidth = month.weeks * weekWidth;
    
    // Render month section
    renderMonth(doc, month, currentX, startY, monthWidth, secondaryColor);
    
    monthPositions.push({
      month: format(month.start, "MMMM yyyy"),
      x: currentX
    });

    // Render weeks for this month
    let weekX = currentX;
    for (let week = 1; week <= month.weeks; week++) {
      renderWeek(
        doc,
        weekX,
        startY,
        weekWidth,
        week,
        tasksLength,
        secondaryColor || "#f1f5f9"
      );
      weekX += weekWidth;
    }
    
    currentX += monthWidth;
  });

  // Draw grid borders
  drawGridBorders(doc, dimensions, startY, currentX, tasksLength);

  return { monthPositions, newStartY: startY };
};