import jsPDF from "jspdf";
import type { PDFTest } from "../types";
import { generateChartImage } from "./pdf/chartGenerator";
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
      
      // Load and add the logo
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = data.publicUrl;
      });

      const imgWidth = 40;
      const imgHeight = (img.height * imgWidth) / img.width;
      doc.addImage(
        img,
        'PNG',
        (pageWidth - imgWidth) / 2,
        10,
        imgWidth,
        imgHeight
      );

      // Adjust starting Y position for title
      doc.setFontSize(20);
      doc.text(test.name, pageWidth / 2, imgHeight + 25, { align: "center" });
      currentY = imgHeight + 35;
    } catch (error) {
      console.error('Error adding logo to PDF:', error);
      // Fallback to default title position if logo fails
      doc.setFontSize(20);
      doc.text(test.name, pageWidth / 2, 20, { align: "center" });
      currentY = 30;
    }
  } else {
    // No logo, use default title position
    doc.setFontSize(20);
    doc.text(test.name, pageWidth / 2, 20, { align: "center" });
    currentY = 30;
  }

  // Add test information
  currentY = addTestInformation(doc, test, currentY);

  // Add chart if results exist
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
    currentY = addExecutiveSummary(doc, test, currentY);
  }

  // Start a new page for results and statistical analysis
  doc.addPage();
  currentY = 20;

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