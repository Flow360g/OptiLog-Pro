import { ChartContainer } from "@/components/ui/chart";
import { Card } from "@/components/ui/card";
import { User } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const weeklyData = [
  { week: "Week 1", count: 4 },
  { week: "Week 2", count: 7 },
  { week: "Week 3", count: 5 },
  { week: "Week 4", count: 9 },
];

const clientData = [
  { name: "Client A", value: 30 },
  { name: "Client B", value: 25 },
  { name: "Client C", value: 20 },
  { name: "Client D", value: 15 },
  { name: "Client E", value: 10 },
];

const platformData = [
  { name: "Facebook", value: 45 },
  { name: "Google", value: 35 },
  { name: "Instagram", value: 20 },
];

const userData = [
  { name: "John", count: 12 },
  { name: "Sarah", count: 8 },
  { name: "Mike", count: 15 },
  { name: "Emma", count: 10 },
];

export const InsightsCharts = () => {
  const renderUserIcon = (props: any) => {
    const { x, y, width, height } = props;
    return (
      <User
        x={x + width / 2 - 12}
        y={y - 24}
        className="w-6 h-6 text-gray-600"
      />
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Weekly Optimizations Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Weekly Optimizations</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Client Distribution Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Client Distribution</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={clientData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {clientData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Platform Distribution Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Platform Distribution</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={platformData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {platformData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* User Optimizations Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Optimizations by User</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={userData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8">
                {userData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
              {userData.map((entry, index) => renderUserIcon({
                x: index * (100 / userData.length),
                y: 0,
                width: 100 / userData.length,
                height: 0
              }))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};