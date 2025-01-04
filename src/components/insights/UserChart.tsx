import { Card } from "@/components/ui/card";
import { User } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { COLORS, userData } from "./insightsData";

export const UserChart = () => {
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
  );
};