import { Navigation } from "@/components/Navigation";
import { Table } from "@/components/ui/table";

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
  ]
};

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 text-center">
          OptiLog Dashboard
        </h1>

        {Object.entries(mockData).map(([client, optimizations]) => (
          <section key={client} className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">{client}</h2>
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