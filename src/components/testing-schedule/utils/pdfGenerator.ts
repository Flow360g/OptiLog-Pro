import jsPDF from "jspdf";
import type { PDFTest } from "../types";
import { generateChartImage } from "./pdf/chartGenerator";
import { 
  addTestInformation, 
  addTestResults, 
  addExecutiveSummary 
} from "./pdf/tableGenerators";

export const generatePDF = async (test: PDFTest) => {
  console.log("Starting PDF generation with test data:", test);
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  // Add title
  doc.setFontSize(20);
  doc.text(test.name, pageWidth / 2, 20, { align: "center" });

  // Add test information
  let currentY = 30;
  currentY = addTestInformation(doc, test, currentY);

  // Add chart if results exist
  if (test.results) {
    try {
      console.log("Generating chart with results:", test.results);
      const chartImage = await generateChartImage(test);
      if (chartImage) {
        currentY += 10;
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

  // Add executive summary if available (now on page 1)
  if (test.executive_summary) {
    console.log("Adding executive summary to PDF");
    currentY = addExecutiveSummary(doc, test, currentY);
  }

  // Start a new page for results and statistical analysis
  doc.addPage();
  currentY = 20;  // Reset Y position for new page

  // Add results if they exist
  if (test.results) {
    console.log("Adding test results to PDF:", {
      results: test.results,
      kpi: test.kpi,
      currentY
    });
    currentY = addTestResults(doc, currentY, test.results, test.kpi);
  }

  // Save the PDF
  const fileName = `${test.name.replace(/\s+/g, "_")}_report.pdf`;
  doc.save(fileName);
};