import type { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { PDFTest } from "../../types";
import { calculateStatisticalSignificance } from "../statisticalCalculations";

export const addTestInformation = (doc: jsPDF, test: PDFTest, startY: number) => {
  const testInfo = [
    ["Test Name", test.name],
    ["Platform", test.platform],
    ["Status", test.status],
    ["Start Date", test.start_date ? new Date(test.start_date).toLocaleDateString() : "Not set"],
    ["End Date", test.end_date ? new Date(test.end_date).toLocaleDateString() : "Not set"],
    ["KPI", test.kpi],
    ["Hypothesis", test.hypothesis],
    ["Test Type", `${test.test_types.test_categories.name} - ${test.test_types.name}`],
  ];

  autoTable(doc, {
    startY,
    body: testInfo,
    theme: 'striped',
    styles: { cellPadding: 5 },
    columnStyles: { 
      0: { fontStyle: 'bold', cellWidth: 80 },
      1: { cellWidth: 'auto' }
    },
  });

  return (doc as any).lastAutoTable.finalY;
};

export const addTestResults = (doc: jsPDF, test: PDFTest, startY: number) => {
  if (!test.results) return startY;

  const { control, experiment } = test.results;
  const controlValue = parseFloat(control);
  const experimentValue = parseFloat(experiment);
  const percentageChange = ((experimentValue - controlValue) / controlValue) * 100;
  const improvement = percentageChange > 0;

  const resultsData = [
    ["Control Group", `${control} ${test.kpi}`],
    ["Experiment Group", `${experiment} ${test.kpi}`],
    ["Improvement", `${Math.abs(percentageChange).toFixed(2)}%`],
    ["Direction", improvement ? "Positive" : "Negative"],
  ];

  autoTable(doc, {
    startY: startY + 10,
    head: [["Results", "Value"]],
    body: resultsData,
    theme: 'striped',
    headStyles: { fillColor: [76, 175, 80], textColor: [255, 255, 255] },
    styles: { cellPadding: 5 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 80 },
      1: { cellWidth: 'auto' }
    },
  });

  // Add Statistical Significance section with correct calculations
  const significanceStartY = (doc as any).lastAutoTable.finalY + 10;
  
  // Calculate conversions based on the actual values
  const controlConversions = Math.round(controlValue * 100);
  const experimentConversions = Math.round(experimentValue * 100);
  const impressions = 100; // Base number for percentage calculation
  
  const results = calculateStatisticalSignificance(
    { conversions: controlConversions, impressions },
    { conversions: experimentConversions, impressions }
  );

  const significanceData = [
    [
      "Statistical Significance",
      results.isSignificant
        ? "Significant test result!"
        : "No significant difference",
    ],
    ["P-value", results.pValue.toFixed(4)],
    ["Relative Lift", `${Math.abs(results.relativeLift).toFixed(2)}%`],
    [
      "Interpretation",
      results.isSignificant
        ? `The experiment group's ${test.kpi} (${experimentValue}) was ${Math.abs(percentageChange).toFixed(2)}% ${improvement ? 'higher' : 'lower'} than the control group's ${test.kpi} (${controlValue}). This difference is statistically significant (p < 0.05).`
        : `The difference between the control (${controlValue}) and experiment (${experimentValue}) groups is not statistically significant.`,
    ],
  ];

  autoTable(doc, {
    startY: significanceStartY,
    head: [["Statistical Analysis", "Details"]],
    body: significanceData,
    theme: 'striped',
    headStyles: { fillColor: [76, 175, 80], textColor: [255, 255, 255] },
    styles: { cellPadding: 5 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 80 },
      1: { cellWidth: 'auto' }
    },
  });

  return (doc as any).lastAutoTable.finalY;
};

export const addExecutiveSummary = (doc: jsPDF, test: PDFTest, startY: number) => {
  if (!test.executive_summary) return startY;

  autoTable(doc, {
    startY: startY + 10,
    head: [["Executive Summary"]],
    body: [[test.executive_summary]],
    theme: 'striped',
    headStyles: { fillColor: [76, 175, 80], textColor: [255, 255, 255] },
    styles: { cellPadding: 5 },
  });

  return (doc as any).lastAutoTable.finalY;
};