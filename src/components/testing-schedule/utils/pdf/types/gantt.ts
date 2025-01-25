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

export const CHART_COLORS = {
  draft: "#94a3b8", // gray
  in_progress: "#3b82f6", // blue
  completed: "#22c55e", // green
  cancelled: "#ef4444", // red
} as const;