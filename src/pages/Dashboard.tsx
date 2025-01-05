import { Navigation } from "@/components/Navigation";
import { Table } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FilterSection } from "@/components/dashboard/FilterSection";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Optimization {
  campaign_name: string;
  platform: string;
  kpi: string;
  recommended_action: string;
  categories: string[];
  effort_level: number;
  impact_level: number;
  optimization_date: string;
  status: string;
}

interface OptimizationsByClient {
  [key: string]: Optimization[];
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [optimizationStatuses, setOptimizationStatuses] = useState<Record<string, string>>({});
  const [optimizationsByClient, setOptimizationsByClient] = useState<OptimizationsByClient>({});
  const [clients, setClients] = useState<string[]>([]);

  useEffect(() => {
    fetchOptimizations();
  }, []);

  const fetchOptimizations = async () => {
    try {
      const { data: optimizations, error } = await supabase
        .from('optimizations')
        .select('*');

      if (error) throw error;

      if (optimizations) {
        // Group optimizations by client
        const grouped = optimizations.reduce((acc: OptimizationsByClient, curr) => {
          if (!acc[curr.client]) {
            acc[curr.client] = [];
          }
          acc[curr.client].push(curr);
          return acc;
        }, {});

        setOptimizationsByClient(grouped);
        setClients(Object.keys(grouped));
      }
    } catch (error) {
      console.error('Error fetching optimizations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch optimizations",
        variant: "destructive",
      });
    }
  };

  const handleCreateOptimization = (client: string) => {
    navigate('/', { 
      state: { 
        preselectedClient: client.toLowerCase() 
      } 
    });
  };

  const handleStatusChange = async (clientIndex: string, optimizationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('optimizations')
        .update({ status: newStatus })
        .eq('id', optimizationId);

      if (error) throw error;

      setOptimizationStatuses(prev => ({
        ...prev,
        [optimizationId]: newStatus
      }));

      // Refresh the optimizations to show the updated status
      fetchOptimizations();
    } catch (error) {
      console.error('Error updating optimization status:', error);
      toast({
        title: "Error",
        description: "Failed to update optimization status",
        variant: "destructive",
      });
    }
  };

  const getOptimizationStatus = (optimizationId: string) => {
    return optimizationStatuses[optimizationId] || "Pending";
  };

  const filteredData = Object.entries(optimizationsByClient).reduce((acc, [client, optimizations]) => {
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
  }, {} as OptimizationsByClient);

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
          clients={clients}
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
                      <th className="text-left p-4 text-gray-900">Date</th>
                      <th className="text-left p-4 text-gray-900">Effort</th>
                      <th className="text-left p-4 text-gray-900">Impact</th>
                      <th className="text-left p-4 text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {optimizations.map((opt) => (
                      <tr 
                        key={opt.campaign_name} 
                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-4 text-gray-700">{opt.campaign_name}</td>
                        <td className="p-4 text-gray-700">{opt.platform}</td>
                        <td className="p-4 text-gray-700">{opt.kpi}</td>
                        <td className="p-4 text-gray-700">{opt.recommended_action}</td>
                        <td className="p-4 text-gray-700">{opt.categories.join(", ")}</td>
                        <td className="p-4 text-gray-700">{format(new Date(opt.optimization_date), "MMM d, yyyy")}</td>
                        <td className="p-4 text-gray-700">{opt.effort_level}</td>
                        <td className="p-4 text-gray-700">{opt.impact_level}</td>
                        <td className="p-4 text-gray-700">
                          <Select
                            value={opt.status || "Pending"}
                            onValueChange={(value) => handleStatusChange(client, opt.id, value)}
                          >
                            <SelectTrigger className="w-[130px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Approved">Approved</SelectItem>
                              <SelectItem value="Disapproved">Disapproved</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
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