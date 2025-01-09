import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Test, TestResult } from "../types";

// Extend the jsPDF type to include the lastAutoTable property
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
      ["Client", test.client],
      ["Platform", test.platform],
      ["Status", test.status],
      ["Start Date", test.start_date?.toString() || "Not set"],
      ["End Date", test.end_date?.toString() || "Not set"],
      ["KPI", test.kpi],
      ["Hypothesis", test.hypothesis],
    ],
  });

  // Add results
  if (test.results) {
    const { control, experiment } = test.results;
    const startY = doc.lastAutoTable.finalY + 10;

    autoTable(doc, {
      startY,
      head: [["Results"]],
      body: [
        ["Control Group", `${control.value}%`],
        ["Experiment Group", `${experiment.value}%`],
        ["Improvement", `${((experiment.value - control.value) / control.value * 100).toFixed(2)}%`],
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