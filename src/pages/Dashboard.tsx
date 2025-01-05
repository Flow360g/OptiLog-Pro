import { Navigation } from "@/components/Navigation";
import { FilterSection } from "@/components/dashboard/FilterSection";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ClientSection } from "@/components/dashboard/ClientSection";
import { OptimizationsByClient } from "@/types/optimization";
import { useUserClients } from "@/hooks/useUserClients";

const Dashboard = () => {
  const { toast } = useToast();
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [optimizationsByClient, setOptimizationsByClient] = useState<OptimizationsByClient>({});
  const { data: userClients = [] } = useUserClients();

  useEffect(() => {
    fetchOptimizations();
  }, [userClients]);

  const fetchOptimizations = async () => {
    try {
      if (!userClients.length) return;

      const { data: optimizations, error } = await supabase
        .from('optimizations')
        .select(`
          *,
          profiles (
            first_name
          )
        `)
        .in('client', userClients);

      if (error) throw error;

      if (optimizations) {
        // Transform the data to include user_first_name at the top level
        const transformedOptimizations = optimizations.map(opt => ({
          ...opt,
          user_first_name: opt.profiles?.first_name || null
        }));

        // Group optimizations by client
        const grouped = transformedOptimizations.reduce((acc: OptimizationsByClient, curr) => {
          if (!acc[curr.client]) {
            acc[curr.client] = [];
          }
          acc[curr.client].push(curr);
          return acc;
        }, {});

        setOptimizationsByClient(grouped);
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

  const handleStatusChange = async (optimizationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('optimizations')
        .update({ status: newStatus })
        .eq('id', optimizationId);

      if (error) throw error;

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
          clients={userClients}
        />

        {Object.entries(filteredData).map(([client, optimizations]) => (
          <ClientSection
            key={client}
            client={client}
            optimizations={optimizations}
            onStatusChange={handleStatusChange}
          />
        ))}
      </main>
    </div>
  );
};

export default Dashboard;