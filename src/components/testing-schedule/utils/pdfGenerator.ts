import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Test, TestResult } from "../types";

interface PDFTest extends Test {
  results: TestResult;
}

export const generateTestResultsPDF = (test: PDFTest) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text(test.name, 20, 20);
  
  // Add test information
  doc.setFontSize(12);
  const testInfo = [
    ["Platform", test.platform],
    ["KPI", test.kpi],
    ["Test Type", `${test.test_types.test_categories.name} - ${test.test_types.name}`],
    ["Hypothesis", test.hypothesis],
    ["Start Date", test.start_date || "Not set"],
    ["End Date", test.end_date || "Not set"],
  ];
  
  autoTable(doc, {
    body: testInfo,
    theme: "plain",
    startY: 30,
  });
  
  // Add results
  const resultsData = [
    ["Metric", "Control", "Experiment", "% Change"],
    [
      test.kpi,
      test.results.control,
      test.results.experiment,
      `${(((parseFloat(test.results.experiment) - parseFloat(test.results.control)) / parseFloat(test.results.control)) * 100).toFixed(1)}%`
    ],
  ];
  
  autoTable(doc, {
    head: [["Test Results"]],
    body: resultsData,
    startY: doc.lastAutoTable.finalY + 10,
  });
  
  // Add executive summary if available
  if (test.executive_summary) {
    autoTable(doc, {
      head: [["Executive Summary"]],
      body: [[test.executive_summary]],
      startY: doc.lastAutoTable.finalY + 10,
    });
  }
  
  // Save the PDF
  doc.save(`${test.name}_results.pdf`);
};