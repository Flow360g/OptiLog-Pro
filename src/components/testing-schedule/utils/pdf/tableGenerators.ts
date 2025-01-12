import type { jsPDF } from "jspdf";
import type { PDFTest } from "../../types";
import { addTestInformation } from "./testInformationTable";
import { addStatisticalAnalysis } from "./statisticalAnalysisTable";
import { addExecutiveSummary } from "./executiveSummaryTable";

export {
  addTestInformation,
  addStatisticalAnalysis as addTestResults,
  addExecutiveSummary,
};