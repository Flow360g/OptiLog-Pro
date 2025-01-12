import type { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { PDFTest } from "../../types";

export const addExecutiveSummary = (doc: jsPDF, test: PDFTest, startY: number) => {
  if (!test.executive_summary) return startY;

  autoTable(doc, {
    startY: startY + 10,
    head: [["Executive Summary"]],
    body: [[test.executive_summary]],
    theme: 'striped',
    headStyles: { fillColor: [76, 175, 80], textColor: [255, 255, 255] },
    styles: { cellPadding: 5 },
  });

  return (doc as any).lastAutoTable.finalY;
};