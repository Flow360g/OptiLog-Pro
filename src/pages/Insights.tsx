import { Navigation } from "@/components/Navigation";
import { InsightsCharts } from "@/components/insights/InsightsCharts";
import { FilterSection } from "@/components/dashboard/FilterSection";
import { useState } from "react";

const Insights = () => {
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "priority",
    "campaign",
    "platform",
    "kpi",
    "action",
    "categories",
    "added_by",
    "status"
  ]);

  const columnDefinitions = [
    { key: "priority", label: "Priority" },
    { key: "campaign", label: "Campaign" },
    { key: "platform", label: "Platform" },
    { key: "kpi", label: "KPI" },
    { key: "action", label: "Action" },
    { key: "categories", label: "Categories" },
    { key: "date", label: "Date" },
    { key: "added_by", label: "Added By" },
    { key: "effort", label: "Effort" },
    { key: "impact", label: "Impact" },
    { key: "status", label: "Status" },
  ];

  const handleColumnToggle = (column: string) => {
    setVisibleColumns((prev) =>
      prev.includes(column)
        ? prev.filter((col) => col !== column)
        : [...prev, column]
    );
  };

  const clients = ["Client A", "Client B", "Client C", "Client D", "Client E"];

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
            visibleColumns={visibleColumns}
            onColumnToggle={handleColumnToggle}
            columnDefinitions={columnDefinitions}
          />
          <InsightsCharts />
        </div>
      </div>
    </div>
  );
};

export default Insights;