import { Navigation } from "@/components/Navigation";
import { InsightsCharts } from "@/components/insights/InsightsCharts";
import { FilterSection } from "@/components/dashboard/FilterSection";
import { InsightNotifications } from "@/components/insights/InsightNotifications";
import { useState } from "react";

const Insights = () => {
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const clients = ["Client A", "Client B", "Client C", "Client D", "Client E"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20">
      <Navigation />
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-center text-gray-900">
            Insights
          </h1>
          <p className="text-lg text-gray-600 mb-8 text-center">
            Analytics and visualization of your optimization data
          </p>
          <InsightNotifications />
          <div className="mb-8">
            <FilterSection
              selectedClient={selectedClient}
              selectedPlatform={selectedPlatform}
              selectedCategory={selectedCategory}
              selectedStatus={selectedStatus}
              onClientChange={setSelectedClient}
              onPlatformChange={setSelectedPlatform}
              onCategoryChange={setSelectedCategory}
              onStatusChange={setSelectedStatus}
              clients={clients}
            />
          </div>
          <InsightsCharts />
        </div>
      </div>
    </div>
  );
};

export default Insights;