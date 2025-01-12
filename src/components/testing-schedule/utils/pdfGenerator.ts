import jsPDF from "jspdf";
import type { PDFTest } from "../types";
import { generateChartImage } from "./pdf/chartGenerator";
import { generateBellCurveImage } from "./pdf/bellCurveGenerator";
import { 
  addTestInformation, 
  addTestResults, 
  addExecutiveSummary 
} from "./pdf/tableGenerators";
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

  // Add logo if available
  if (profile?.logo_path) {
    try {
      const { data } = supabase.storage
        .from('logos')
        .getPublicUrl(profile.logo_path);
      
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = data.publicUrl;
      });

      const imgWidth = 80;
      const imgHeight = (img.height * imgWidth) / img.width;
      doc.addImage(
        img,
        'PNG',
        (pageWidth - imgWidth) / 2,
        currentY,
        imgWidth,
        imgHeight
      );

      doc.setFontSize(20);
      doc.text("Test Overview", pageWidth / 2, imgHeight + 15, { align: "center" });
      doc.setFontSize(16);
      doc.text(test.name, pageWidth / 2, imgHeight + 30, { align: "center" });
      currentY = imgHeight + 40;
    } catch (error) {
      console.error('Error adding logo to PDF:', error);
      doc.setFontSize(20);
      doc.text("Test Overview", pageWidth / 2, currentY, { align: "center" });
      doc.setFontSize(16);
      doc.text(test.name, pageWidth / 2, currentY + 15, { align: "center" });
      currentY = 45;
    }
  } else {
    doc.setFontSize(20);
    doc.text("Test Overview", pageWidth / 2, currentY, { align: "center" });
    doc.setFontSize(16);
    doc.text(test.name, pageWidth / 2, currentY + 15, { align: "center" });
    currentY = 45;
  }

  currentY = addTestInformation(doc, test, currentY, profile?.secondary_color);

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

  if (test.executive_summary) {
    console.log("Adding executive summary to PDF");
    currentY = addExecutiveSummary(doc, test, currentY, profile?.secondary_color);
  }

  if (test.results) {
    console.log("Adding test results to PDF:", {
      results: test.results,
      kpi: test.kpi,
      currentY
    });
    currentY = addTestResults(doc, currentY, test.results, test.kpi, profile?.secondary_color);

    // Add bell curve chart at the bottom of page 2
    try {
      const bellCurveImage = await generateBellCurveImage(test.results, profile?.primary_color, profile?.secondary_color);
      if (bellCurveImage) {
        const imgWidth = 180;
        const imgHeight = 90;
        
        // If we're close to the bottom of the page, move to next page
        if (currentY + imgHeight > doc.internal.pageSize.height - 20) {
          doc.addPage();
          currentY = 20;
        } else {
          currentY += 20; // Add some spacing
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