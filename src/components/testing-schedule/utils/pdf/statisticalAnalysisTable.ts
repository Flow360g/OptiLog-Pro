import type { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { calculateStatisticalSignificance } from "../statisticalCalculations";

interface TestResults {
  control: string;
  experiment: string;
  statistical_data?: {
    control: {
      conversions: string;
      impressions: string;
    };
    experiment: {
      conversions: string;
      impressions: string;
    };
  };
}

const parsePercentage = (value: string | undefined | null): number => {
  if (!value) return 0;
  return parseFloat(value.replace('%', '')) / 100;
};

export const addStatisticalAnalysis = (
  doc: jsPDF,
  startY: number,
  results: TestResults,
  kpi: string,
  secondaryColor?: string | null
) => {
  const controlValue = parsePercentage(results.control);
  const experimentValue = parsePercentage(results.experiment);
  const percentageChange = controlValue === 0 ? 0 : ((experimentValue - controlValue) / controlValue) * 100;
  const improvement = percentageChange > 0;

  let stats;
  let controlImpressions: number;
  let experimentImpressions: number;
  
  if (results.statistical_data) {
    controlImpressions = parseInt(results.statistical_data.control.impressions) || 0;
    experimentImpressions = parseInt(results.statistical_data.experiment.impressions) || 0;
    
    stats = calculateStatisticalSignificance(
      {
        conversions: parseInt(results.statistical_data.control.conversions) || 0,
        impressions: controlImpressions
      },
      {
        conversions: parseInt(results.statistical_data.experiment.conversions) || 0,
        impressions: experimentImpressions
      }
    );
  } else {
    const BASE_SAMPLE_SIZE = 10000;
    controlImpressions = BASE_SAMPLE_SIZE;
    experimentImpressions = BASE_SAMPLE_SIZE;
    const controlConversions = Math.round(controlValue * BASE_SAMPLE_SIZE);
    const experimentConversions = Math.round(experimentValue * BASE_SAMPLE_SIZE);
    
    stats = calculateStatisticalSignificance(
      { conversions: controlConversions, impressions: BASE_SAMPLE_SIZE },
      { conversions: experimentConversions, impressions: BASE_SAMPLE_SIZE }
    );
  }

  const rgbColor = secondaryColor ? hexToRgb(secondaryColor) : [76, 175, 80];

  const resultsData = [
    ["Control Group", `${(controlValue * 100).toFixed(2)}% ${kpi}`],
    ["Experiment Group", `${(experimentValue * 100).toFixed(2)}% ${kpi}`],
    ["Improvement", `${Math.abs(percentageChange).toFixed(2)}%`],
    ["Direction", improvement ? "Positive" : "Negative"],
  ];

  autoTable(doc, {
    startY: startY + 10,
    head: [["Results", "Value"]],
    body: resultsData,
    theme: 'striped',
    headStyles: { 
      fillColor: rgbColor as [number, number, number],
      textColor: [255, 255, 255] 
    },
    styles: { 
      cellPadding: 3,
      minCellHeight: 6
    },
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
        ? `The experiment group's ${kpi} (${(experimentValue * 100).toFixed(2)}%) was ${Math.abs(percentageChange).toFixed(2)}% ${improvement ? 'higher' : 'lower'} than the control group's ${kpi} (${(controlValue * 100).toFixed(2)}%). At the given sample sizes (Control: ${controlImpressions.toLocaleString()}, Experiment: ${experimentImpressions.toLocaleString()}), this difference is statistically significant (p < 0.05), indicating that the observed uplift is unlikely due to random chance.`
        : `The difference between the control (${(controlValue * 100).toFixed(2)}%) and experiment (${(experimentValue * 100).toFixed(2)}%) groups is not statistically significant at the current sample sizes (Control: ${controlImpressions.toLocaleString()}, Experiment: ${experimentImpressions.toLocaleString()}).`,
    ],
  ];

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 5,
    head: [["Statistical Analysis", "Details"]],
    body: significanceData,
    theme: 'striped',
    headStyles: { 
      fillColor: rgbColor as [number, number, number],
      textColor: [255, 255, 255] 
    },
    styles: { 
      cellPadding: 3,
      minCellHeight: 6
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 80 },
      1: { cellWidth: 'auto' }
    },
  });

  return (doc as any).lastAutoTable.finalY;
};

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [76, 175, 80];
}