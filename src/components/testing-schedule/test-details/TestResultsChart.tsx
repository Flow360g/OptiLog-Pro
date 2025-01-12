import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { TestResult } from "../types";

interface TestResultsChartProps {
  results: TestResult;
  kpi: string;
}

export function TestResultsChart({ results, kpi }: TestResultsChartProps) {
  const chartData = [
    { name: "Control", value: parseFloat(results.control) || 0 },
    { name: "Experiment", value: parseFloat(results.experiment) || 0 },
  ];

  const winningValue = Math.max(
    parseFloat(results.control) || 0,
    parseFloat(results.experiment) || 0
  );

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Results Comparison</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value">
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === 0 ? "#000000" : (entry.value === winningValue ? "#22c55e" : "#64748b")}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}