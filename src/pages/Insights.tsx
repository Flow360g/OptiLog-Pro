import { Navigation } from "@/components/Navigation";
import { InsightsCharts } from "@/components/insights/InsightsCharts";

const Insights = () => {
  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <Navigation />
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-center text-gray-900">
            Insights
          </h1>
          <p className="text-lg text-gray-600 mb-8 text-center">
            Analytics and visualization of your optimization data
          </p>
          <InsightsCharts />
        </div>
      </div>
    </div>
  );
};

export default Insights;