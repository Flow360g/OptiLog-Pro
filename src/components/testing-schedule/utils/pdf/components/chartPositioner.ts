import { jsPDF } from "jspdf";

export const positionChartInDocument = (
  doc: jsPDF,
  chartImage: string,
  pageWidth: number,
  currentY: number
): number => {
  const imgWidth = 150;
  const imgHeight = 75;

  doc.addImage(
    chartImage,
    "PNG",
    (pageWidth - imgWidth) / 2,
    currentY,
    imgWidth,
    imgHeight
  );

  return currentY + imgHeight + 10;
};

export const positionBellCurveInDocument = (
  doc: jsPDF,
  bellCurveImage: string,
  pageWidth: number,
  currentY: number
): void => {
  if (currentY > doc.internal.pageSize.height - 100) {
    doc.addPage();
  }

  const imgWidth = 160;
  const imgHeight = 80;
  const bottomMargin = 20;
  const yPosition = doc.internal.pageSize.height - imgHeight - bottomMargin;

  doc.addImage(
    bellCurveImage,
    "PNG",
    (pageWidth - imgWidth) / 2,
    yPosition,
    imgWidth,
    imgHeight
  );
};