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
    <div className="min-h-screen bg-[#100c2a]">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-white text-center">
          OptiLog Dashboard
        </h1>

        {Object.entries(mockData).map(([client, optimizations]) => (
          <section key={client} className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-white">{client}</h2>
            <div className="bg-white/5 backdrop-blur-lg rounded-lg border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-4 text-white">Campaign</th>
                      <th className="text-left p-4 text-white">Platform</th>
                      <th className="text-left p-4 text-white">KPI</th>
                      <th className="text-left p-4 text-white">Action</th>
                      <th className="text-left p-4 text-white">Categories</th>
                      <th className="text-left p-4 text-white">Effort</th>
                      <th className="text-left p-4 text-white">Impact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {optimizations.map((opt, index) => (
                      <tr 
                        key={index} 
                        className="border-b border-white/10 hover:bg-white/5 transition-colors"
                      >
                        <td className="p-4 text-white">{opt.campaign}</td>
                        <td className="p-4 text-white">{opt.platform}</td>
                        <td className="p-4 text-white">{opt.kpi}</td>
                        <td className="p-4 text-white">{opt.recommendedAction}</td>
                        <td className="p-4 text-white">{opt.categories.join(", ")}</td>
                        <td className="p-4 text-white">{opt.effort}</td>
                        <td className="p-4 text-white">{opt.impact}</td>
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