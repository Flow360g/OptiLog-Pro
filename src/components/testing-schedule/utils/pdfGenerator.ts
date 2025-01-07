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
    head: [["Field", "Value"]],
    body: [
      ["Test Name", test.name],
      ["Platform", test.platform],
      ["KPI", test.kpi],
      ["Test Type", `${test.test_types.test_categories.name} - ${test.test_types.name}`],
      ["Hypothesis", test.hypothesis],
      ["Start Date", test.start_date ? new Date(test.start_date).toLocaleDateString() : "Not set"],
      ["End Date", test.end_date ? new Date(test.end_date).toLocaleDateString() : "Not set"],
      ["Effort Level", test.effort_level ? `${test.effort_level}/5` : "Not set"],
      ["Impact Level", test.impact_level ? `${test.impact_level}/5` : "Not set"],
    ],
    theme: "grid",
  });

  // Get the Y position after the first table
  const firstTableEndY = (doc as any).lastAutoTable.finalY + 10;

  // Add results table
  autoTable(doc, {
    startY: firstTableEndY,
    head: [["Metric", "Value"]],
    body: [
      ["Control", `${test.results?.control || "0"}`],
      ["Experiment", `${test.results?.experiment || "0"}`],
      ["Improvement", `${improvement.toFixed(2)}%`],
    ],
    theme: "grid",
  });

  // Get the Y position after the second table
  const secondTableEndY = (doc as any).lastAutoTable.finalY + 10;

  // Add bar chart
  const chartWidth = 160;
  const chartHeight = 80;
  const barWidth = 40;
  const maxValue = Math.max(controlValue, experimentValue);
  const scale = chartHeight / maxValue;

  // Draw chart background
  doc.setDrawColor(200, 200, 200);
  doc.setFillColor(255, 255, 255);
  doc.rect(20, secondTableEndY, chartWidth, chartHeight + 20, "F");

  // Draw bars
  // Control bar
  doc.setFillColor(100, 116, 139); // slate-500
  const controlHeight = controlValue * scale;
  doc.rect(40, secondTableEndY + chartHeight - controlHeight, barWidth, controlHeight, "F");

  // Experiment bar
  const experimentHeight = experimentValue * scale;
  if (experimentValue > controlValue) {
    // Base part (equal to control)
    doc.setFillColor(100, 116, 139); // slate-500
    doc.rect(100, secondTableEndY + chartHeight - controlHeight, barWidth, controlHeight, "F");
    // Winning increment in green
    doc.setFillColor(34, 197, 94); // green-500
    doc.rect(100, secondTableEndY + chartHeight - experimentHeight, barWidth, experimentHeight - controlHeight, "F");
  } else {
    doc.setFillColor(100, 116, 139); // slate-500
    doc.rect(100, secondTableEndY + chartHeight - experimentHeight, barWidth, experimentHeight, "F");
  }

  // Add labels
  doc.setFontSize(10);
  doc.text("Control", 40, secondTableEndY + chartHeight + 15, { align: "left" });
  doc.text("Experiment", 100, secondTableEndY + chartHeight + 15, { align: "left" });
  
  // Add values on top of bars
  doc.text(controlValue.toString(), 40, secondTableEndY + chartHeight - controlHeight - 5, { align: "left" });
  doc.text(experimentValue.toString(), 100, secondTableEndY + chartHeight - experimentHeight - 5, { align: "left" });

  doc.save(`test-results-${test.name}.pdf`);
};