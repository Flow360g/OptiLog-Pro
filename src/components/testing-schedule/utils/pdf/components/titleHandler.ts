import { jsPDF } from "jspdf";

export const addTitle = (
  doc: jsPDF,
  clientName: string,
  titleY: number,
  pageWidth: number
): void => {
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(
    `${clientName.toUpperCase()} - Testing Schedule`,
    pageWidth / 2,
    titleY,
    { align: "center" }
  );
  doc.setFont("helvetica", "normal");
};