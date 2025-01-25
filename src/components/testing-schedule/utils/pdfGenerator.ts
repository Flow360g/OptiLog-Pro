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
import { addLogoToDocument } from "./pdf/components/logoHandler";
import { addTitleToDocument } from "./pdf/components/titleHandler";
import { positionChartInDocument, positionBellCurveInDocument } from "./pdf/components/chartPositioner";

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

  // Add logo and get new Y position
  const { newY, error: logoError } = await addLogoToDocument(
    doc,
    profile?.logo_path,
    supabase,
    pageWidth,
    currentY
  );
  
  // Add title and test name
  currentY = logoError 
    ? addTitleToDocument(doc, "Test Overview", test.name, pageWidth, currentY)
    : newY;

  // Add test information
  currentY = addTestInformation(doc, test, currentY, profile?.secondary_color);

  // Add chart if results exist
  if (test.results) {
    try {
      console.log("Generating chart with results:", test.results);
      const chartImage = await generateChartImage(test, profile?.primary_color, profile?.secondary_color);
      if (chartImage) {
        currentY = positionChartInDocument(doc, chartImage, pageWidth, currentY + 10);
      }
    } catch (error) {
      console.error("Error adding chart to PDF:", error);
    }
  }

  // Add executive summary if it exists
  if (test.executive_summary) {
    console.log("Adding executive summary to PDF");
    currentY = addExecutiveSummary(doc, test, currentY, profile?.secondary_color);
  }

  // Add test results if they exist
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
        positionBellCurveInDocument(doc, bellCurveImage, pageWidth, currentY);
      }
    } catch (error) {
      console.error("Error adding bell curve to PDF:", error);
    }
  }

  const fileName = `${test.name.replace(/\s+/g, "_")}_report.pdf`;
  doc.save(fileName);
};