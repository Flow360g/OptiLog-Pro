import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Test, TestResult } from "../types";
import { Chart } from "chart.js/auto";

declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}

interface PDFTest extends Test {
  results: TestResult;
}

const generateChartImage = async (test: PDFTest): Promise<string> => {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 300;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';

  const control = parseFloat(test.results.control);
  const experiment = parseFloat(test.results.experiment);
  const winningValue = Math.max(control, experiment);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Control', 'Experiment'],
      datasets: [{
        label: test.kpi,
        data: [control, experiment],
        backgroundColor: [
          control === winningValue ? '#22c55e' : '#64748b',
          experiment === winningValue ? '#22c55e' : '#64748b'
        ],
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  return canvas.toDataURL('image/png');
};

export const generatePDF = async (test: PDFTest) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  // Add title
  doc.setFontSize(20);
  doc.text(test.name, pageWidth / 2, 20, { align: "center" });

  // Add test information
  doc.setFontSize(12);
  autoTable(doc, {
    startY: 30,
    head: [["Test Information"]],
    body: [
      ["Platform", test.platform],
      ["Status", test.status],
      ["Start Date", test.start_date?.toString() || "Not set"],
      ["End Date", test.end_date?.toString() || "Not set"],
      ["KPI", test.kpi],
      ["Hypothesis", test.hypothesis],
      ["Test Type", `${test.test_types.test_categories.name} - ${test.test_types.name}`],
    ],
  });

  // Add chart
  if (test.results) {
    const chartImage = await generateChartImage(test);
    if (chartImage) {
      const startY = doc.lastAutoTable.finalY + 10;
      const imgWidth = 150;
      const imgHeight = 75;
      doc.addImage(
        chartImage,
        'PNG',
        (pageWidth - imgWidth) / 2,
        startY,
        imgWidth,
        imgHeight
      );
    }
  }

  // Add results
  if (test.results) {
    const { control, experiment } = test.results;
    const percentageChange = ((parseFloat(experiment) - parseFloat(control)) / parseFloat(control) * 100);
    const startY = doc.lastAutoTable.finalY + 90; // Add more space for the chart

    autoTable(doc, {
      startY,
      head: [["Results"]],
      body: [
        ["Control Group", `${control} ${test.kpi}`],
        ["Experiment Group", `${experiment} ${test.kpi}`],
        ["Improvement", `${percentageChange.toFixed(2)}%`],
      ],
    });
  }

  // Add executive summary if available
  if (test.executive_summary) {
    const startY = doc.lastAutoTable.finalY + 10;
    autoTable(doc, {
      startY,
      head: [["Executive Summary"]],
      body: [[test.executive_summary]],
    });
  }

  // Save the PDF
  const fileName = `${test.name.replace(/\s+/g, '_')}_report.pdf`;
  doc.save(fileName);
};