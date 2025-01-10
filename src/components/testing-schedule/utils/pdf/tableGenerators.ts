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
    head: [["Test Information", "Details"]],
    body: testInfo,
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

  // Add Statistical Significance section
  const significanceStartY = (doc as any).lastAutoTable.finalY + 10;
  const results = calculateStatisticalSignificance(
    { conversions: Math.round(controlValue * 1000), impressions: 1000 },
    { conversions: Math.round(experimentValue * 1000), impressions: 1000 }
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
        ? `You can be 95% confident that this result is a consequence of the changes made and not random chance.`
        : `The difference between the variants is not statistically significant.`,
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