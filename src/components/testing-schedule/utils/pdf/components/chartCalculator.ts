import { Test } from "../../../types";
import { GanttTask, ChartDimensions } from "../types/gantt";
import { ChartConfig } from "../types/pdf";

export const calculateChartDimensions = (
  doc: jsPDF,
  tasks: GanttTask[],
  titleY: number
): {
  dimensions: ChartDimensions;
  chartStartY: number;
  chartHeight: number;
} => {
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Calculate the longest task name to determine left padding
  const maxTaskNameLength = Math.max(...tasks.map(task => task.name.length));
  const taskNameWidth = maxTaskNameLength * 5;
  const leftPadding = taskNameWidth + 30;

  // Chart dimensions - centered on page
  const chartWidth = pageWidth - leftPadding - 50;
  const chartStartX = leftPadding;

  const dimensions: ChartDimensions = {
    chartStartX,
    chartWidth,
    rowHeight: 40,
    dayWidth: 0 // This will be calculated later when we have the date range
  };

  // Calculate vertical positioning
  const chartHeight = tasks.length * dimensions.rowHeight + 100;
  const availableSpace = pageHeight - (titleY + 50);
  const chartStartY = titleY + 50 + (availableSpace - chartHeight) / 2;

  return { dimensions, chartStartY, chartHeight };
};

export const prepareChartData = (tests: Test[]): {
  tasks: GanttTask[];
  minDate: Date;
  maxDate: Date;
} => {
  const tasksWithDates = tests.filter(
    (test): test is Test & { start_date: string; end_date: string } =>
      test.start_date !== null && test.end_date !== null
  );

  const tasks: GanttTask[] = tasksWithDates.map((test) => ({
    name: test.name,
    startDate: new Date(test.start_date),
    endDate: new Date(test.end_date),
    status: test.status,
  }));

  const allDates = tasks.flatMap((task) => [task.startDate, task.endDate]);
  const minDate = new Date(Math.min(...allDates.map((d) => d.getTime())));
  const maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())));

  return { tasks, minDate, maxDate };
};