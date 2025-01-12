import { Test } from "../../types";
import { calculateStatisticalSignificance } from "../statisticalCalculations";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

export const generateTestInformationTable = (doc: jsPDF, test: Test) => {
  const testInfo = [
    ["Test Name", test.name],
    ["Platform", test.platform],
    ["Start Date", test.start_date ? new Date(test.start_date).toLocaleDateString() : "Not set"],
    ["End Date", test.end_date ? new Date(test.end_date).toLocaleDateString() : "Not set"],
    ["KPI", test.kpi],
    ["Hypothesis", test.hypothesis],
  ];

  (doc as any).autoTable({
    body: testInfo,
    theme: "plain",
    styles: {
      cellPadding: 5,
      fontSize: 10,
      textColor: [60, 60, 60],
    },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 100 },
      1: { cellWidth: "auto" },
    },
  });
};

export const generateResultsTable = (doc: jsPDF, test: Test) => {
  if (!test.results) return;

  const controlValue = parseFloat(test.results.control);
  const experimentValue = parseFloat(test.results.experiment);
  const percentageChange = ((experimentValue - controlValue) / controlValue) * 100;
  const improvement = percentageChange > 0;

  const resultsData = [
    ["Metric", "Control", "Experiment", "% Change"],
    [
      test.kpi,
      test.results.control,
      test.results.experiment,
      `${percentageChange.toFixed(2)}%`,
    ],
  ];

  (doc as any).autoTable({
    head: [resultsData[0]],
    body: [resultsData[1]],
    theme: "striped",
    headStyles: {
      fillColor: [76, 175, 80],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    styles: {
      cellPadding: 5,
      fontSize: 10,
    },
  });

  // Add Statistical Significance section
  const significanceStartY = (doc as any).lastAutoTable.finalY + 10;

  const results = calculateStatisticalSignificance(
    { conversions: Math.round(controlValue), impressions: 1000 },
    { conversions: Math.round(experimentValue), impressions: 1000 }
  );

  const significanceData = [
    ["Metric", "Value"],
    ["P-Value", results.pValue.toFixed(4)],
    ["Confidence Level", `${((1 - results.pValue) * 100).toFixed(2)}%`],
    [
      "Interpretation",
      results.isSignificant
        ? `The experiment group's ${test.kpi} (${experimentValue}) was ${Math.abs(percentageChange).toFixed(2)}% ${improvement ? 'higher' : 'lower'} than the control group's ${test.kpi} (${controlValue}). This difference is statistically significant (p < 0.05).`
        : `The difference between the control (${controlValue}) and experiment (${experimentValue}) groups is not statistically significant.`,
    ],
  ];

  (doc as any).autoTable({
    startY: significanceStartY,
    body: significanceData,
    theme: "plain",
    styles: {
      cellPadding: 5,
      fontSize: 10,
    },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 100 },
      1: { cellWidth: "auto" },
    },
  });
};