import { Test } from "../../../types";

export interface GanttTask {
  name: string;
  startDate: Date;
  endDate: Date;
  status: string;
}

export interface ChartDimensions {
  chartStartX: number;
  chartWidth: number;
  rowHeight: number;
  dayWidth: number;
}

export interface MonthPosition {
  month: string;
  x: number;
}

// Using more subtle, pastel colors for different test statuses
export const CHART_COLORS = {
  draft: "#E5DEFF", // soft purple
  in_progress: "#D3E4FD", // soft blue
  completed: "#F2FCE2", // soft green
  cancelled: "#FFDEE2", // soft pink
} as const;