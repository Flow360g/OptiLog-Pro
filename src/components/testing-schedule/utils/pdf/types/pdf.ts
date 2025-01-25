import { Test } from "../../../types";
import { GanttTask, ChartDimensions } from "./gantt";

export interface PDFConfig {
  doc: jsPDF;
  tests: Test[];
  startY: number;
  userId: string;
  clientName: string;
}

export interface ChartConfig {
  tasks: GanttTask[];
  minDate: Date;
  maxDate: Date;
  dimensions: ChartDimensions;
  titleY: number;
  chartStartY: number;
}