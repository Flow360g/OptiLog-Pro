import jsPDF from "jspdf";
import { Test } from "../../types";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const CHART_START_Y = 60;
const CHART_HEIGHT_PER_TEST = 30;
const CHART_PADDING = 10;
const DATE_COLUMN_WIDTH = 40;
const CHART_AREA_WIDTH = 180; // Increased width for landscape

export const generateGanttChartPDF = async (tests: Test[]) => {
  // Initialize PDF in landscape orientation
  const doc = new jsPDF({ orientation: 'landscape' });
  const pageWidth = doc.internal.pageSize.width;
  let currentY = 10;

  // Get user's brand settings
  const { data: profile } = await supabase
    .from('profiles')
    .select('primary_color, secondary_color, logo_path')
    .eq('id', tests[0]?.user_id)
    .single();

  const primaryColor = profile?.primary_color || '#9b87f5';
  const secondaryColor = profile?.secondary_color || '#7E69AB';

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
      currentY = imgHeight + 20;
    } catch (error) {
      console.error('Error adding logo to PDF:', error);
      currentY = 20;
    }
  }

  // Add title
  doc.setFontSize(20);
  doc.text("Testing Schedule - Gantt Chart", pageWidth / 2, currentY, { align: "center" });
  currentY += 20;

  // Filter tests with dates
  const testsWithDates = tests.filter(test => test.start_date && test.end_date);

  if (testsWithDates.length === 0) {
    doc.setFontSize(12);
    doc.text("No tests with scheduled dates found.", pageWidth / 2, currentY + 20, { align: "center" });
    doc.save("testing_schedule_gantt.pdf");
    return;
  }

  // Find date range
  const startDates = testsWithDates.map(test => new Date(test.start_date!));
  const endDates = testsWithDates.map(test => new Date(test.end_date!));
  const minDate = new Date(Math.min(...startDates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...endDates.map(d => d.getTime())));

  // Draw timeline
  doc.setFontSize(10);
  doc.setDrawColor(200);
  doc.line(DATE_COLUMN_WIDTH, CHART_START_Y - 5, pageWidth - 20, CHART_START_Y - 5);

  // Draw tests
  testsWithDates.forEach((test, index) => {
    const y = CHART_START_Y + (index * CHART_HEIGHT_PER_TEST);
    
    // Add alternating background colors
    if (index % 2 === 0) {
      doc.setFillColor(255, 255, 255); // White
    } else {
      doc.setFillColor(245, 245, 245); // Light grey
    }
    doc.rect(10, y - 5, pageWidth - 30, CHART_HEIGHT_PER_TEST, 'F');
    
    // Draw test name
    doc.setFontSize(10);
    doc.text(test.name, 10, y + 5, { maxWidth: DATE_COLUMN_WIDTH - 5 });

    // Calculate bar position and width
    const startDate = new Date(test.start_date!);
    const endDate = new Date(test.end_date!);
    const totalDays = (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24);
    const startOffset = (startDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24);
    const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

    const barX = DATE_COLUMN_WIDTH + (startOffset / totalDays * CHART_AREA_WIDTH);
    const barWidth = (duration / totalDays * CHART_AREA_WIDTH);

    // Draw bar
    doc.setFillColor(test.status === 'completed' ? secondaryColor : primaryColor);
    doc.rect(barX, y, barWidth, 10, 'F');

    // Add dates
    doc.setFontSize(8);
    doc.text(format(startDate, 'MM/dd'), barX, y + 20);
    doc.text(format(endDate, 'MM/dd'), barX + barWidth, y + 20);
  });

  doc.save("testing_schedule_gantt.pdf");
};