import type { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { PDFTest } from "../../types";

export const addTestInformation = (doc: jsPDF, test: PDFTest, startY: number, secondaryColor?: string | null) => {
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

  const rgbColor = secondaryColor ? hexToRgb(secondaryColor) : [76, 175, 80];

  autoTable(doc, {
    startY,
    head: [["Test Information", "Details"]],
    body: testInfo,
    theme: 'striped',
    headStyles: { 
      fillColor: rgbColor as [number, number, number],
      textColor: [255, 255, 255] 
    },
    styles: { 
      cellPadding: 4,
      minCellHeight: 8.5
    },
    columnStyles: { 
      0: { fontStyle: 'bold', cellWidth: 80 },
      1: { cellWidth: 'auto' }
    },
  });

  return (doc as any).lastAutoTable.finalY;
};

// Helper function to convert hex to RGB
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [76, 175, 80];
}