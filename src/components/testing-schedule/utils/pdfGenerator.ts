import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Test } from "../types";

export const generateTestResultsPDF = (test: Test) => {
  const doc = new jsPDF();
  const controlValue = parseFloat(test.results?.control || "0");
  const experimentValue = parseFloat(test.results?.experiment || "0");
  const improvement = ((experimentValue - controlValue) / controlValue) * 100;

  // Add title
  doc.setFontSize(20);
  doc.text("Test Results Report", 20, 20);

  // Add test details
  doc.setFontSize(12);
  autoTable(doc, {
    startY: 30,
    head: [["Test Details"]],
    body: [
      ["Name", test.name],
      ["Platform", test.platform],
      ["KPI", test.kpi],
      ["Hypothesis", test.hypothesis],
    ],
    theme: "grid",
  });

  // Add results
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [["Metric", "Value"]],
    body: [
      ["Control", `${test.results?.control || "0"}`],
      ["Experiment", `${test.results?.experiment || "0"}`],
      ["Improvement", `${improvement.toFixed(2)}%`],
    ],
    theme: "grid",
  });

  doc.save(`test-results-${test.name}.pdf`);
};