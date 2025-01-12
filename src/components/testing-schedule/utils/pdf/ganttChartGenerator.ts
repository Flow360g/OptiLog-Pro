import jsPDF from "jspdf";
import { Test } from "../../types";
import { supabase } from "@/integrations/supabase/client";

declare var google: any;

const loadGoogleCharts = async () => {
  return new Promise((resolve) => {
    if (typeof google !== 'undefined' && google.visualization) {
      resolve(google.visualization);
    } else {
      const script = document.createElement('script');
      script.src = 'https://www.gstatic.com/charts/loader.js';
      script.onload = () => {
        google.charts.load('current', { packages: ['gantt'] });
        google.charts.setOnLoadCallback(() => resolve(google.visualization));
      };
      document.head.appendChild(script);
    }
  });
};

const getStatusPercentage = (status: Test['status']) => {
  switch (status) {
    case 'completed':
      return 100;
    case 'in_progress':
      return 50;
    case 'scheduled':
      return 25;
    case 'draft':
    default:
      return 0;
  }
};

const createGanttChart = async (tests: Test[], visualization: any) => {
  const data = new visualization.DataTable();
  data.addColumn('string', 'Task ID');
  data.addColumn('string', 'Task Name');
  data.addColumn('string', 'Resource');
  data.addColumn('date', 'Start Date');
  data.addColumn('date', 'End Date');
  data.addColumn('number', 'Duration');
  data.addColumn('number', 'Percent Complete');
  data.addColumn('string', 'Dependencies');

  const rows = tests.map(test => [
    test.id,
    test.name,
    test.platform,
    test.start_date ? new Date(test.start_date) : new Date(),
    test.end_date ? new Date(test.end_date) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    null,
    getStatusPercentage(test.status),
    null
  ]);

  data.addRows(rows);

  const options = {
    height: 400,
    width: 800,
    gantt: {
      trackHeight: 30,
      labelStyle: {
        fontName: 'Arial',
        fontSize: 12
      },
      barCornerRadius: 3,
      innerGridHorizLine: {
        stroke: '#e0e0e0',
        strokeWidth: 1
      },
      innerGridTrack: { fill: '#f5f5f5' },
      innerGridDarkTrack: { fill: '#f0f0f0' },
      labelMaxWidth: 200,
      barLabelStyle: {
        left: true // This will place labels on the left side of bars
      }
    }
  };

  const container = document.createElement('div');
  container.style.width = '800px';
  container.style.height = '400px';
  document.body.appendChild(container);

  const chart = new visualization.Gantt(container);
  chart.draw(data, options);

  return new Promise<string>((resolve) => {
    setTimeout(() => {
      const svg = container.querySelector('svg');
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          const pngData = canvas.toDataURL('image/png');
          document.body.removeChild(container);
          resolve(pngData);
        };
        
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
      } else {
        document.body.removeChild(container);
        resolve('');
      }
    }, 1000);
  });
};

export const generateGanttChartPDF = async (tests: Test[]) => {
  try {
    const visualization = await loadGoogleCharts();
    const chartImage = await createGanttChart(tests, visualization);
    
    if (!chartImage) {
      console.error('Failed to generate chart image');
      return;
    }

    // Get user's brand settings
    const { data: profile } = await supabase
      .from('profiles')
      .select('primary_color, secondary_color, logo_path')
      .eq('id', tests[0]?.user_id)
      .single();

    // Create PDF in landscape orientation
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    let currentY = 10;

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

        const imgWidth = 30;
        const imgHeight = (img.height * imgWidth) / img.width;
        doc.addImage(
          img,
          'PNG',
          (pageWidth - imgWidth) / 2,
          currentY,
          imgWidth,
          imgHeight
        );
        currentY += imgHeight + 10;
      } catch (error) {
        console.error('Error adding logo to PDF:', error);
      }
    }

    // Add title
    doc.setFontSize(16);
    doc.text("Test Schedule - Gantt Chart", pageWidth / 2, currentY, { align: "center" });
    currentY += 20;

    // Add chart with adjusted dimensions for landscape
    const chartWidth = pageWidth - 20; // Leave some margins
    const chartHeight = pageHeight - currentY - 10; // Leave some bottom margin
    doc.addImage(
      chartImage,
      'PNG',
      10, // Left margin
      currentY,
      chartWidth,
      chartHeight
    );

    // Save the PDF
    doc.save('test_schedule_gantt.pdf');
  } catch (error) {
    console.error('Error generating Gantt chart PDF:', error);
  }
};