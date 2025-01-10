import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Chart } from "chart.js/auto";
import type { PDFTest } from "../types";
import { calculateStatisticalSignificance } from "../utils/statisticalCalculations";

const generateChartImage = async (test: PDFTest): Promise<string> => {
  // Create a canvas element in memory
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 300;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const control = parseFloat(test.results?.control || '0');
  const experiment = parseFloat(test.results?.experiment || '0');
  const winningValue = Math.max(control, experiment);

  // Create and configure the chart
  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Control', 'Experiment'],
      datasets: [{
        label: test.kpi,
        data: [control, experiment],
        backgroundColor: [
          control === winningValue ? '#22c55e' : '#64748b',
          experiment === winningValue ? '#22c55e' : '#64748b'
        ]
      }]
    },
    options: {
      responsive: false,
      animation: false,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  // Ensure chart is rendered
  await new Promise(resolve => setTimeout(resolve, 200));

  try {
    // Get base64 image data
    const imageData = canvas.toDataURL('image/png', 1.0);
    chart.destroy();
    return imageData;
  } catch (error) {
    console.error('Error generating chart image:', error);
    chart.destroy();
    return '';
  }
};

export const generatePDF = async (test: PDFTest) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  // Add title
  doc.setFontSize(20);
  doc.text(test.name, pageWidth / 2, 20, { align: "center" });

  // Add test information
  doc.setFontSize(12);
  autoTable(doc, {
    startY: 30,
    head: [["Test Information"]],
    body: [
      ["Platform", test.platform],
      ["Status", test.status],
      ["Start Date", test.start_date?.toString() || "Not set"],
      ["End Date", test.end_date?.toString() || "Not set"],
      ["KPI", test.kpi],
      ["Hypothesis", test.hypothesis],
      ["Test Type", `${test.test_types.test_categories.name} - ${test.test_types.name}`]
    ]
  });

  // Add chart if results exist
  if (test.results) {
    try {
      const chartImage = await generateChartImage(test);
      if (chartImage) {
        const startY = (doc as any).lastAutoTable.finalY + 10;
        const imgWidth = 150;
        const imgHeight = 75;
        
        doc.addImage(
          chartImage,
          'PNG',
          (pageWidth - imgWidth) / 2,
          startY,
          imgWidth,
          imgHeight
        );
      }
    } catch (error) {
      console.error('Error adding chart to PDF:', error);
    }
  }

  // Add results if they exist
  if (test.results) {
    const { control, experiment } = test.results;
    const percentageChange = ((parseFloat(experiment) - parseFloat(control)) / parseFloat(control)) * 100;
    const controlRate = parseFloat(control);
    const experimentRate = parseFloat(experiment);
    
    const startY = (doc as any).lastAutoTable.finalY + (test.results ? 90 : 10);
    
    autoTable(doc, {
      startY,
      head: [["Results"]],
      body: [
        ["Control Group", `${control} ${test.kpi}`],
        ["Experiment Group", `${experiment} ${test.kpi}`],
        ["Improvement", `${percentageChange.toFixed(2)}%`]
      ]
    });

    // Add statistical significance results
    const significanceStartY = (doc as any).lastAutoTable.finalY + 10;
    const results = calculateStatisticalSignificance(
      { conversions: Math.round(controlRate * 1000), impressions: 1000 },
      { conversions: Math.round(experimentRate * 1000), impressions: 1000 }
    );

    autoTable(doc, {
      startY: significanceStartY,
      head: [["Statistical Significance"]],
      body: [
        ["Result", results.isSignificant ? "Significant test result!" : "No significant difference"],
        ["P-value", results.pValue.toFixed(4)],
        ["Relative Lift", `${Math.abs(results.relativeLift).toFixed(2)}%`],
        ["Interpretation", results.isSignificant 
          ? `You can be 95% confident that this result is a consequence of the changes made and not random chance.`
          : `The difference between the variants is not statistically significant.`
        ]
      ]
    });
  }

  // Add executive summary if available
  if (test.executive_summary) {
    const startY = (doc as any).lastAutoTable.finalY + 10;
    autoTable(doc, {
      startY,
      head: [["Executive Summary"]],
      body: [[test.executive_summary]]
    });
  }

  // Save the PDF
  const fileName = `${test.name.replace(/\s+/g, '_')}_report.pdf`;
  doc.save(fileName);
};
