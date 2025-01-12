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

const parsePercentage = (value: string): number => {
  // Remove % sign if present and convert to decimal
  return parseFloat(value.replace('%', '')) / 100;
};

export const addStatisticalAnalysis = (
  doc: jsPDF,
  startY: number,
  results: TestResults,
  kpi: string
) => {
  console.log("Adding statistical analysis with:", { results, kpi, startY });
  
  const controlValue = parsePercentage(results.control);
  const experimentValue = parsePercentage(results.experiment);
  const percentageChange = ((experimentValue - controlValue) / controlValue) * 100;
  const improvement = percentageChange > 0;

  let stats;
  let controlImpressions: number;
  let experimentImpressions: number;
  
  if (results.statistical_data) {
    // Use actual statistical data if available
    controlImpressions = parseInt(results.statistical_data.control.impressions);
    experimentImpressions = parseInt(results.statistical_data.experiment.impressions);
    
    stats = calculateStatisticalSignificance(
      {
        conversions: parseInt(results.statistical_data.control.conversions),
        impressions: controlImpressions
      },
      {
        conversions: parseInt(results.statistical_data.experiment.conversions),
        impressions: experimentImpressions
      }
    );
  } else {
    // Fallback to basic sample size if no statistical data
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

  console.log("Calculated statistics:", stats);

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
        ? `The experiment group's ${kpi} (${(experimentValue * 100).toFixed(2)}%) was ${Math.abs(percentageChange).toFixed(2)}% ${improvement ? 'higher' : 'lower'} than the control group's ${kpi} (${(controlValue * 100).toFixed(2)}%). At the given sample sizes (Control: ${controlImpressions.toLocaleString()}, Experiment: ${experimentImpressions.toLocaleString()}), this difference is statistically significant (p < 0.05), indicating that the observed uplift is unlikely due to random chance.`
        : `The difference between the control (${(controlValue * 100).toFixed(2)}%) and experiment (${(experimentValue * 100).toFixed(2)}%) groups is not statistically significant at the current sample sizes (Control: ${controlImpressions.toLocaleString()}, Experiment: ${experimentImpressions.toLocaleString()}).`,
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