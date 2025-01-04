import { Navigation } from "@/components/Navigation";
import { Table } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FilterSection } from "@/components/dashboard/FilterSection";
import { useState } from "react";

// Mock data - in a real app, this would come from your backend
const mockData = {
  "OES": [
    {
      campaign: "Summer Campaign 2024",
      platform: "Facebook",
      kpi: "CPC",
      recommendedAction: "Optimize ad relevance score",
      categories: ["Creative", "Targeting"],
      effort: "3",
      impact: "4"
    }
  ],
  "28 By Sam Wood": [
    {
      campaign: "Fitness Challenge Q1",
      platform: "Google",
      kpi: "CTR",
      recommendedAction: "Test different ad copy variations",
      categories: ["Ad Copy", "Creative"],
      effort: "2",
      impact: "4"
    }
  ],
  "GMHBA": [
    {
      campaign: "Health Insurance Q2",
      platform: "Facebook",
      kpi: "ROAS",
      recommendedAction: "Adjust targeting parameters",
      categories: ["Targeting", "Budget"],
      effort: "3",
      impact: "5"
    }
  ]
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCreateOptimization = (client: string) => {
    navigate('/', { 
      state: { 
        preselectedClient: client.toLowerCase() 
      } 
    });
  };

  const filteredData = Object.entries(mockData).reduce((acc, [client, optimizations]) => {
    if (selectedClient && selectedClient !== client) {
      return acc;
    }

    const filteredOptimizations = optimizations.filter(opt => {
      const platformMatch = !selectedPlatform || opt.platform === selectedPlatform;
      const categoryMatch = !selectedCategory || opt.categories.includes(selectedCategory);
      return platformMatch && categoryMatch;
    });

    if (filteredOptimizations.length > 0) {
      acc[client] = filteredOptimizations;
    }

    return acc;
  }, {} as typeof mockData);

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 text-center">
          OptiLog Dashboard
        </h1>

        <FilterSection
          selectedClient={selectedClient}
          selectedPlatform={selectedPlatform}
          selectedCategory={selectedCategory}
          onClientChange={setSelectedClient}
          onPlatformChange={setSelectedPlatform}
          onCategoryChange={setSelectedCategory}
          clients={Object.keys(mockData)}
        />

        {Object.entries(filteredData).map(([client, optimizations]) => (
          <section key={client} className="mb-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-900">{client}</h2>
              <Button 
                onClick={() => handleCreateOptimization(client)}
                className="gradient-bg"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Optimization
              </Button>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <Table>
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left p-4 text-gray-900">Campaign</th>
                      <th className="text-left p-4 text-gray-900">Platform</th>
                      <th className="text-left p-4 text-gray-900">KPI</th>
                      <th className="text-left p-4 text-gray-900">Action</th>
                      <th className="text-left p-4 text-gray-900">Categories</th>
                      <th className="text-left p-4 text-gray-900">Effort</th>
                      <th className="text-left p-4 text-gray-900">Impact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {optimizations.map((opt, index) => (
                      <tr 
                        key={index} 
                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-4 text-gray-700">{opt.campaign}</td>
                        <td className="p-4 text-gray-700">{opt.platform}</td>
                        <td className="p-4 text-gray-700">{opt.kpi}</td>
                        <td className="p-4 text-gray-700">{opt.recommendedAction}</td>
                        <td className="p-4 text-gray-700">{opt.categories.join(", ")}</td>
                        <td className="p-4 text-gray-700">{opt.effort}</td>
                        <td className="p-4 text-gray-700">{opt.impact}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </section>
        ))}
      </main>
    </div>
  );
};

export default Dashboard;