import { jsPDF } from "jspdf";

export const addTitleToDocument = (
  doc: jsPDF,
  title: string,
  testName: string,
  pageWidth: number,
  currentY: number
): number => {
  doc.setFontSize(20);
  doc.text(title, pageWidth / 2, currentY, { align: "center" });
  doc.setFontSize(16);
  doc.text(testName, pageWidth / 2, currentY + 15, { align: "center" });
  return currentY + 30;
};

export const addTitle = (
  doc: jsPDF,
  title: string,
  y: number,
  pageWidth: number,
  subtitle?: string
): number => {
  doc.setFontSize(20);
  doc.text(title, pageWidth / 2, y, { align: "center" });
  
  if (subtitle) {
    doc.setFontSize(16);
    doc.text(subtitle, pageWidth / 2, y + 15, { align: "center" });
    return y + 30;
  }
  
  return y + 20;
};