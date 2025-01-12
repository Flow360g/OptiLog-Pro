import type { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { PDFTest } from "../../types";

export const addTestInformation = (doc: jsPDF, test: PDFTest, startY: number) => {
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

  autoTable(doc, {
    startY,
    body: testInfo,
    theme: 'striped',
    styles: { 
      cellPadding: 4,  // Reduced from 5 to 4
      minCellHeight: 8.5  // Reduced by 15% from 10
    },
    columnStyles: { 
      0: { fontStyle: 'bold', cellWidth: 80 },
      1: { cellWidth: 'auto' }
    },
  });

  return (doc as any).lastAutoTable.finalY;
};