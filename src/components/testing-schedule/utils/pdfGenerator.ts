import jsPDF from "jspdf";
import type { PDFTest } from "../types";
import { generateChartImage } from "./pdf/chartGenerator";
import { generateBellCurveImage } from "./pdf/bellCurveGenerator";
import { addLogo } from "./pdf/logoHandler";
import { addTestInformation } from "./pdf/testInformationTable";
import { addTestResults } from "./pdf/statisticalAnalysisTable";
import { addExecutiveSummary } from "./pdf/executiveSummaryTable";
import { supabase } from "@/integrations/supabase/client";

export const generatePDF = async (test: PDFTest) => {
  console.log("Starting PDF generation with test data:", test);
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  let currentY = 10;

  // Get user's brand settings
  const { data: profile } = await supabase
    .from('profiles')
    .select('primary_color, secondary_color, logo_path')
    .eq('id', test.user_id)
    .single();

  // Add logo and title
  currentY = await addLogo(doc, profile?.logo_path, currentY);
  
  // Add title
  doc.setFontSize(20);
  doc.text("Test Overview", pageWidth / 2, currentY, { align: "center" });
  doc.setFontSize(16);
  doc.text(test.name, pageWidth / 2, currentY + 15, { align: "center" });
  currentY += 30;

  // Add test information
  currentY = addTestInformation(doc, test, currentY, profile?.secondary_color);

  // Add results chart if available
  if (test.results) {
    try {
      console.log("Generating chart with results:", test.results);
      const chartImage = await generateChartImage(test, profile?.primary_color, profile?.secondary_color);
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

  // Add executive summary if available
  if (test.executive_summary) {
    console.log("Adding executive summary to PDF");
    currentY = addExecutiveSummary(doc, test, currentY, profile?.secondary_color);
  }

  // Add test results if available
  if (test.results) {
    console.log("Adding test results to PDF");
    currentY = addTestResults(doc, currentY, test.results, test.kpi, profile?.secondary_color);

    // Add bell curve chart
    try {
      const bellCurveImage = await generateBellCurveImage(test.results, profile?.primary_color, profile?.secondary_color);
      if (bellCurveImage) {
        const imgWidth = 180;
        const imgHeight = 90;
        
        if (currentY + imgHeight > doc.internal.pageSize.height - 20) {
          doc.addPage();
          currentY = 20;
        } else {
          currentY += 20;
        }

        doc.addImage(
          bellCurveImage,
          "PNG",
          (pageWidth - imgWidth) / 2,
          currentY,
          imgWidth,
          imgHeight
        );
      }
    } catch (error) {
      console.error("Error adding bell curve to PDF:", error);
    }
  }

  const fileName = `${test.name.replace(/\s+/g, "_")}_report.pdf`;
  doc.save(fileName);
};