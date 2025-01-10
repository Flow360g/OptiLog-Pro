import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Chart } from "chart.js/auto";
import type { PDFTest } from "../types";
import { calculateStatisticalSignificance } from "./statisticalCalculations";

const generateChartImage = async (test: PDFTest): Promise<string> => {
  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 300;

  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const control = parseFloat(test.results?.control || "0");
  const experiment = parseFloat(test.results?.experiment || "0");
  const winningValue = Math.max(control, experiment);

  const chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Control", "Experiment"],
      datasets: [
        {
          label: test.kpi,
          data: [control, experiment],
          backgroundColor: [
            control === winningValue ? "#22c55e" : "#64748b",
            experiment === winningValue ? "#22c55e" : "#64748b",
          ],
        },
      ],
    },
    options: {
      responsive: false,
      animation: false,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  await new Promise((resolve) => setTimeout(resolve, 200));

  try {
    const imageData = canvas.toDataURL("image/png", 1.0);
    chart.destroy();
    return imageData;
  } catch (error) {
    console.error("Error generating chart image:", error);
    chart.destroy();
    return "";
  }
};

const addTestInformation = (doc: jsPDF, test: PDFTest, startY: number) => {
  const testInfo = [
    ["Test Name", test.name],
    ["Platform", test.platform],
    ["Status", test.status],
    ["Start Date", test.start_date ? new Date(test.start_date).toLocaleDateString() : "Not set"],
    ["End Date", test.end_date ? new Date(test.end_date).toLocaleDateString() : "Not set"],
    ["KPI", test.kpi],
    ["Hypothesis", test.hypothesis],
    [
      "Test Type",
      `${test.test_types.test_categories.name} - ${test.test_types.name}`,
    ],
  ];

  autoTable(doc, {
    startY,
    head: [["Test Information", "Details"]],
    body: testInfo,
    theme: 'striped',
    headStyles: { fillColor: [34, 197, 94] },
    styles: { cellPadding: 5 },
    columnStyles: { 
      0: { fontStyle: 'bold', cellWidth: 80 },
      1: { cellWidth: 'auto' }
    },
  });

  return (doc as any).lastAutoTable.finalY;
};

const addTestResults = (doc: jsPDF, test: PDFTest, startY: number) => {
  if (!test.results) return startY;

  const { control, experiment } = test.results;
  const controlValue = parseFloat(control);
  const experimentValue = parseFloat(experiment);
  const percentageChange = ((experimentValue - controlValue) / controlValue) * 100;
  const improvement = percentageChange > 0;

  const resultsData = [
    ["Control Group", `${control} ${test.kpi}`],
    ["Experiment Group", `${experiment} ${test.kpi}`],
    ["Improvement", `${percentageChange.toFixed(2)}%`],
    ["Direction", improvement ? "Positive" : "Negative"],
  ];

  autoTable(doc, {
    startY: startY + 10,
    head: [["Results", "Value"]],
    body: resultsData,
    theme: 'striped',
    headStyles: { fillColor: [34, 197, 94] },
    styles: { cellPadding: 5 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 80 },
      1: { cellWidth: 'auto' }
    },
  });

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
    headStyles: { fillColor: [34, 197, 94] },
    styles: { cellPadding: 5 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 80 },
      1: { cellWidth: 'auto' }
    },
  });

  return (doc as any).lastAutoTable.finalY;
};

const addExecutiveSummary = (doc: jsPDF, test: PDFTest, startY: number) => {
  if (!test.executive_summary) return startY;

  autoTable(doc, {
    startY: startY + 10,
    head: [["Executive Summary"]],
    body: [[test.executive_summary]],
    theme: 'striped',
    headStyles: { fillColor: [34, 197, 94] },
    styles: { cellPadding: 5 },
  });

  return (doc as any).lastAutoTable.finalY;
};

export const generatePDF = async (test: PDFTest) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  // Add title
  doc.setFontSize(20);
  doc.text(test.name, pageWidth / 2, 20, { align: "center" });

  // Add test information
  let currentY = 30;
  currentY = addTestInformation(doc, test, currentY);

  // Add chart if results exist
  if (test.results) {
    try {
      const chartImage = await generateChartImage(test);
      if (chartImage) {
        currentY += 10;
        const imgWidth = 150;
        const imgHeight = 75;

        doc.addImage(
          chartImage,
          "PNG",
          (pageWidth - imgWidth) / 2,
          currentY,
          imgWidth,
          imgHeight
        );
        currentY += imgHeight + 10;
      }
    } catch (error) {
      console.error("Error adding chart to PDF:", error);
    }
  }

  // Add results if they exist
  if (test.results) {
    currentY = addTestResults(doc, test, currentY);
  }

  // Add executive summary if available
  if (test.executive_summary) {
    currentY = addExecutiveSummary(doc, test, currentY);
  }

  // Save the PDF
  const fileName = `${test.name.replace(/\s+/g, "_")}_report.pdf`;
  doc.save(fileName);
};