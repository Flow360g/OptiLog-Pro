import jsPDF from "jspdf";
import type { PDFTest } from "../types";
import { generateChartImage } from "./pdf/chartGenerator";
import { generateTestInformationTable, generateResultsTable } from "./pdf/tableGenerators";

export const generatePDF = async (test: PDFTest) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  // Add title
  doc.setFontSize(20);
  doc.text(test.name, pageWidth / 2, 20, { align: "center" });

  // Add test information
  let currentY = 30;
  generateTestInformationTable(doc, test);
  currentY = (doc as any).lastAutoTable.finalY + 10;

  // Add chart if results exist
  if (test.results) {
    try {
      const chartImage = await generateChartImage(test);
      if (chartImage) {
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
        currentY += imgHeight + 10;
      }
    } catch (error) {
      console.error("Error adding chart to PDF:", error);
    }
  }

  // Add results if they exist
  if (test.results) {
    generateResultsTable(doc, test);
  }

  // Save the PDF
  const fileName = `${test.name.replace(/\s+/g, "_")}_report.pdf`;
  doc.save(fileName);
};