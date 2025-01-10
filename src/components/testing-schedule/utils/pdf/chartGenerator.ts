import { Chart } from "chart.js/auto";
import type { PDFTest } from "../../types";

export const generateChartImage = async (test: PDFTest): Promise<string> => {
  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 300;

  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const control = parseFloat(test.results?.control || "0");
  const experiment = parseFloat(test.results?.experiment || "0");
  const winningValue = Math.max(control, experiment);

  const chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Control", "Experiment"],
      datasets: [
        {
          label: test.kpi,
          data: [control, experiment],
          backgroundColor: [
            control === winningValue ? "#22c55e" : "#64748b",
            experiment === winningValue ? "#22c55e" : "#64748b",
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