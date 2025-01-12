import type { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { calculateStatisticalSignificance } from "../statisticalCalculations";

interface TestResults {
  control: string;
  experiment: string;
}

export const addStatisticalAnalysis = (
  doc: jsPDF,
  startY: number,
  results: TestResults,
  kpi: string
) => {
  console.log("Adding statistical analysis with:", { results, kpi, startY });
  
  const controlValue = parseFloat(results.control);
  const experimentValue = parseFloat(results.experiment);
  const percentageChange = ((experimentValue - controlValue) / controlValue) * 100;
  const improvement = percentageChange > 0;

  const BASE_SAMPLE_SIZE = 10000;
  const controlConversions = Math.round(controlValue * BASE_SAMPLE_SIZE);
  const experimentConversions = Math.round(experimentValue * BASE_SAMPLE_SIZE);
  
  const stats = calculateStatisticalSignificance(
    { conversions: controlConversions, impressions: BASE_SAMPLE_SIZE },
    { conversions: experimentConversions, impressions: BASE_SAMPLE_SIZE }
  );

  console.log("Calculated statistics:", stats);

  const resultsData = [
    ["Control Group", `${results.control} ${kpi}`],
    ["Experiment Group", `${results.experiment} ${kpi}`],
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

  const significanceData = [
    [
      "Statistical Significance",
      stats.isSignificant
        ? "Significant test result!"
        : "No significant difference",
    ],
    ["P-value", stats.pValue.toFixed(4)],
    ["Relative Lift", `${Math.abs(stats.relativeLift).toFixed(2)}%`],
    [
      "Interpretation",
      stats.isSignificant
        ? `The experiment group's ${kpi} (${experimentValue}) was ${Math.abs(percentageChange).toFixed(2)}% ${improvement ? 'higher' : 'lower'} than the control group's ${kpi} (${controlValue}). This difference is statistically significant (p < 0.05).`
        : `The difference between the control (${controlValue}) and experiment (${experimentValue}) groups is not statistically significant.`,
    ],
  ];

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 10,
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