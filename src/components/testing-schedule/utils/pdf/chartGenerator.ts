import { Chart } from "chart.js/auto";
import type { PDFTest } from "../../types";

export const generateChartImage = async (
  test: PDFTest,
  primaryColor?: string | null,
  secondaryColor?: string | null
): Promise<string> => {
  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 300;

  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const control = parseFloat(test.results?.control || "0");
  const experiment = parseFloat(test.results?.experiment || "0");
  const winningValue = Math.max(control, experiment);

  // Use brand colors if available, otherwise fallback to defaults
  const defaultColor = "#64748b";
  const successColor = primaryColor || "#22c55e";

  const chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Control", "Experiment"],
      datasets: [
        {
          label: test.kpi,
          data: [control, experiment],
          backgroundColor: [
            "#6B7280", // Control bar is now mid-level grey
            experiment === winningValue ? successColor : defaultColor,
          ],
        },
      ],
    },
    options: {
      responsive: false,
      animation: false,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  await new Promise((resolve) => setTimeout(resolve, 200));

  try {
    const imageData = canvas.toDataURL("image/png", 1.0);
    chart.destroy();
    return imageData;
  } catch (error) {
    console.error("Error generating chart image:", error);
    chart.destroy();
    return "";
  }
};