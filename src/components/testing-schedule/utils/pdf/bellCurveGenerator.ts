import { Chart } from "chart.js/auto";
import type { TestResult } from "../../types";

function generateBellCurveData(mean: number, stdDev: number, start: number, end: number) {
  const points = 100;
  const data = [];
  for (let i = 0; i < points; i++) {
    const x = start + (i * (end - start)) / points;
    const y =
      (1 / (stdDev * Math.sqrt(2 * Math.PI))) *
      Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2)) *
      60; // Scale factor to make the curves more visible
    data.push({ x, y });
  }
  return data;
}

export const generateBellCurveImage = async (
  results: TestResult,
  primaryColor?: string | null,
  secondaryColor?: string | null
): Promise<string> => {
  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 300;

  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const control = parseFloat(results.control || "0");
  const experiment = parseFloat(results.experiment || "0");
  
  // Assuming a standard deviation of 20% of the mean for visualization
  const controlStdDev = control * 0.2;
  const experimentStdDev = experiment * 0.2;
  
  // Generate data points for both curves
  const minValue = Math.min(control, experiment) * 0.5;
  const maxValue = Math.max(control, experiment) * 1.5;
  
  const controlData = generateBellCurveData(control, controlStdDev, minValue, maxValue);
  const experimentData = generateBellCurveData(experiment, experimentStdDev, minValue, maxValue);

  const chart = new Chart(ctx, {
    type: "line",
    data: {
      datasets: [
        {
          label: "Control",
          data: controlData,
          borderColor: "#6B7280",
          backgroundColor: "rgba(107, 114, 128, 0.1)",
          fill: true,
          tension: 0.4,
        },
        {
          label: "Experiment",
          data: experimentData,
          borderColor: primaryColor || "#22c55e",
          backgroundColor: `${primaryColor || "#22c55e"}1a`, // 10% opacity
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: false,
      animation: false,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Expected Distributions",
          padding: 10,
        },
      },
      scales: {
        x: {
          type: "linear",
          position: "bottom",
          title: {
            display: true,
            text: "Value",
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Frequency",
          },
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
    console.error("Error generating bell curve image:", error);
    chart.destroy();
    return "";
  }
};