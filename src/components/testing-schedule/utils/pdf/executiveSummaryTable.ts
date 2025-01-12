import type { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { PDFTest } from "../../types";

export const addExecutiveSummary = (doc: jsPDF, test: PDFTest, startY: number, secondaryColor?: string | null) => {
  if (!test.executive_summary) return startY;

  const rgbColor = secondaryColor ? hexToRgb(secondaryColor) : [76, 175, 80];

  autoTable(doc, {
    startY: startY + 10,
    head: [["Executive Summary"]],
    body: [[test.executive_summary]],
    theme: 'striped',
    headStyles: { 
      fillColor: rgbColor as [number, number, number],
      textColor: [255, 255, 255] 
    },
    styles: { cellPadding: 5 },
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