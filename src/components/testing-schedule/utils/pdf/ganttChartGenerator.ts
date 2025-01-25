import jsPDF from "jspdf";
import { Test } from "../../types";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

interface GanttTask {
  name: string;
  startDate: Date;
  endDate: Date;
  status: string;
}

const CHART_COLORS = {
  draft: "#94a3b8", // gray
  in_progress: "#3b82f6", // blue
  completed: "#22c55e", // green
  cancelled: "#ef4444", // red
};

const generateGanttChart = async (
  doc: jsPDF,
  tests: Test[],
  startY: number = 50,
  userId: string
): Promise<number> => {
  // Filter out tests without dates
  const tasksWithDates = tests.filter(
    (test): test is Test & { start_date: string; end_date: string } =>
      test.start_date !== null && test.end_date !== null
  );

  if (tasksWithDates.length === 0) {
    doc.setFontSize(12);
    doc.text("No tests with dates available", 20, startY);
    return startY + 20;
  }

  // Convert tests to GanttTask format
  const tasks: GanttTask[] = tasksWithDates.map((test) => ({
    name: test.name,
    startDate: new Date(test.start_date),
    endDate: new Date(test.end_date),
    status: test.status,
  }));

  // Find date range
  const allDates = tasks.flatMap((task) => [task.startDate, task.endDate]);
  const minDate = new Date(Math.min(...allDates.map((d) => d.getTime())));
  const maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())));

  // Chart dimensions
  const chartStartX = 150; // Space for task names
  const chartWidth = doc.internal.pageSize.width - chartStartX - 40; // Added more padding
  const rowHeight = 20;
  const totalDays = Math.ceil(
    (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const dayWidth = chartWidth / totalDays;

  // Get user's profile for logo
  const { data: profile } = await supabase
    .from('profiles')
    .select('logo_path')
    .eq('id', userId)
    .single();

  // Add logo if available with increased size (250% bigger)
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

      const imgWidth = 200; // Increased from 80 to 200 (250% bigger)
      const imgHeight = (img.height * imgWidth) / img.width;
      doc.addImage(
        img,
        'PNG',
        (doc.internal.pageSize.width - imgWidth) / 2,
        10,
        imgWidth,
        imgHeight
      );
      startY = imgHeight + 40; // Increased spacing after logo
    } catch (error) {
      console.error('Error adding logo to PDF:', error);
    }
  }

  // Draw header
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);

  // Draw month and week labels
  let currentDate = new Date(minDate);
  let weekNumber = 1;
  const monthPositions: { month: string; x: number }[] = [];

  while (currentDate <= maxDate) {
    const x = chartStartX + (currentDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24) * dayWidth;
    
    // Store month position for drawing later
    if (currentDate.getDate() === 1 || currentDate === minDate) {
      monthPositions.push({
        month: format(currentDate, "MMMM"),
        x
      });
    }

    // Draw week numbers
    doc.setFontSize(8);
    doc.text(`W${weekNumber}`, x, startY - 5, { align: "center" });
    
    weekNumber = weekNumber % 4 + 1;
    currentDate.setDate(currentDate.getDate() + 7);
  }

  // Draw month labels above week numbers with increased spacing
  doc.setFontSize(10);
  monthPositions.forEach((month, index) => {
    const nextMonth = monthPositions[index + 1];
    const monthWidth = nextMonth ? nextMonth.x - month.x : chartWidth - (month.x - chartStartX);
    doc.text(month.month, month.x + monthWidth / 2, startY - 25, { align: "center" });
  });

  startY += 10;

  // Draw tasks
  tasks.forEach((task, index) => {
    const y = startY + index * rowHeight;

    // Draw task name
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(task.name.substring(0, 30) + (task.name.length > 30 ? "..." : ""), 20, y + 5);

    // Draw task bar
    const taskStartX =
      chartStartX +
      (task.startDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24) * dayWidth;
    const taskWidth =
      ((task.endDate.getTime() - task.startDate.getTime()) / (1000 * 60 * 60 * 24)) *
      dayWidth;

    doc.setFillColor(CHART_COLORS[task.status as keyof typeof CHART_COLORS]);
    doc.rect(taskStartX, y, taskWidth, rowHeight - 5, "F");
  });

  // Draw vertical grid lines for weeks and months
  doc.setDrawColor(200, 200, 200);
  currentDate = new Date(minDate);
  while (currentDate <= maxDate) {
    const x =
      chartStartX +
      (currentDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24) * dayWidth;
    
    // Darker lines for months, lighter for weeks
    doc.setDrawColor(currentDate.getDate() === 1 ? 150 : 220, currentDate.getDate() === 1 ? 150 : 220, currentDate.getDate() === 1 ? 150 : 220);
    doc.line(x, startY - 5, x, startY + tasks.length * rowHeight);
    
    currentDate.setDate(currentDate.getDate() + 7);
  }

  // Draw horizontal grid lines
  doc.setDrawColor(220, 220, 220);
  tasks.forEach((_, index) => {
    const y = startY + index * rowHeight;
    doc.line(chartStartX, y, chartStartX + chartWidth, y);
  });

  return startY + tasks.length * rowHeight + 20;
};

export const generateGanttPDF = async (tests: Test[], clientName: string) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "pt",
  });

  // Get current user's ID for profile lookup
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("No user found");
  }

  // Add centered title below logo
  doc.setFontSize(20);
  doc.text(`${clientName.toUpperCase()} - Testing Schedule`, doc.internal.pageSize.width / 2, 30, { align: "center" });

  // Generate Gantt chart with user ID
  await generateGanttChart(doc, tests, 80, user.id);

  // Save the PDF
  doc.save(`${clientName}_testing_schedule.pdf`);
};