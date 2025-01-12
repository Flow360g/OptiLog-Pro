import jsPDF from "jspdf";
import { Test } from "../../types";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const CHART_START_Y = 80;
const CHART_HEIGHT_PER_TEST = 30;
const CHART_PADDING = 10;
const DATE_COLUMN_WIDTH = 80;
const CHART_AREA_WIDTH = 400;
const CELL_HEIGHT = 20;

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

  // Draw header
  doc.setFillColor(52, 103, 174);
  doc.setTextColor(255, 255, 255);
  doc.rect(10, currentY, DATE_COLUMN_WIDTH, CELL_HEIGHT, 'F');
  doc.setFontSize(12);
  doc.text("Task Name", 15, currentY + 14);

  // Calculate quarters and months
  const months = [];
  let currentDate = new Date(minDate);
  while (currentDate <= maxDate) {
    months.push(new Date(currentDate));
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  // Draw quarter headers
  let currentQuarter = '';
  let quarterStartX = DATE_COLUMN_WIDTH + 10;
  let quarterWidth = 0;
  
  months.forEach((month, index) => {
    const quarter = `Q${Math.floor(month.getMonth() / 3) + 1} ${month.getFullYear()}`;
    const cellWidth = CHART_AREA_WIDTH / months.length;
    
    if (quarter !== currentQuarter) {
      if (quarterWidth > 0) {
        doc.setFillColor(52, 103, 174);
        doc.rect(quarterStartX, currentY, quarterWidth, CELL_HEIGHT, 'F');
        doc.text(currentQuarter, quarterStartX + quarterWidth / 2, currentY + 14, { align: 'center' });
      }
      currentQuarter = quarter;
      quarterStartX = DATE_COLUMN_WIDTH + 10 + (index * cellWidth);
      quarterWidth = cellWidth;
    } else {
      quarterWidth += cellWidth;
    }
  });

  // Draw last quarter header if needed
  if (quarterWidth > 0) {
    doc.setFillColor(52, 103, 174);
    doc.rect(quarterStartX, currentY, quarterWidth, CELL_HEIGHT, 'F');
    doc.text(currentQuarter, quarterStartX + quarterWidth / 2, currentY + 14, { align: 'center' });
  }

  currentY += CELL_HEIGHT;

  // Draw month headers
  doc.setFillColor(240, 240, 240);
  doc.setTextColor(0);
  months.forEach((month, index) => {
    const cellWidth = CHART_AREA_WIDTH / months.length;
    const x = DATE_COLUMN_WIDTH + 10 + (index * cellWidth);
    doc.rect(x, currentY, cellWidth, CELL_HEIGHT, 'F');
    doc.text(format(month, 'MMM yy'), x + cellWidth / 2, currentY + 14, { align: 'center' });
  });

  currentY += CELL_HEIGHT;

  // Draw tests
  testsWithDates.forEach((test, index) => {
    const y = currentY + (index * CHART_HEIGHT_PER_TEST);
    
    // Add alternating background colors
    if (index % 2 === 0) {
      doc.setFillColor(255, 255, 255);
    } else {
      doc.setFillColor(248, 248, 248);
    }
    doc.rect(10, y, pageWidth - 20, CHART_HEIGHT_PER_TEST, 'F');
    
    // Draw test name
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text(test.name, 15, y + 15, { maxWidth: DATE_COLUMN_WIDTH - 10 });

    // Calculate bar position and width
    const startDate = new Date(test.start_date!);
    const endDate = new Date(test.end_date!);
    const totalDays = (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24);
    const startOffset = (startDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24);
    const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

    const barX = DATE_COLUMN_WIDTH + 10 + (startOffset / totalDays * CHART_AREA_WIDTH);
    const barWidth = (duration / totalDays * CHART_AREA_WIDTH);

    // Draw bar
    doc.setFillColor(test.status === 'completed' ? secondaryColor : primaryColor);
    doc.roundedRect(barX, y + 10, barWidth, 10, 2, 2, 'F');

    // Add dates
    doc.setFontSize(8);
    doc.text(format(startDate, 'MM/dd'), barX, y + 25);
    doc.text(format(endDate, 'MM/dd'), barX + barWidth, y + 25);
  });

  doc.save("testing_schedule_gantt.pdf");
};