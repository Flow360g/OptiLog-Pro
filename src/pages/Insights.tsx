import { InsightsCharts } from "@/components/insights/InsightsCharts";
import { FilterSection } from "@/components/dashboard/FilterSection";
import { InsightNotifications } from "@/components/insights/InsightNotifications";

export default function Insights() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20">
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-center text-gray-900">
            Insights
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Track your optimization performance and get insights
          </p>
          <InsightNotifications />
          <InsightsCharts />
        </div>
      </div>
    </div>
  );
}