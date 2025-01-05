import { Navigation } from "@/components/Navigation";
import { FilterSection } from "@/components/dashboard/FilterSection";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ClientSection } from "@/components/dashboard/ClientSection";
import { OptimizationsByClient } from "@/types/optimization";
import { useUserClients } from "@/hooks/useUserClients";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from '@supabase/auth-helpers-react';

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { session, isLoading: isSessionLoading } = useSessionContext();
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [optimizationsByClient, setOptimizationsByClient] = useState<OptimizationsByClient>({});
  const { data: userClients = [] } = useUserClients();
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

  useEffect(() => {
    if (!isSessionLoading && !session) {
      navigate("/login");
    }
  }, [session, isSessionLoading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!session) {
          navigate("/login");
          return;
        }
        
        if (userClients.length > 0) {
          await fetchOptimizations();
        }
      } catch (error) {
        console.error('Error in fetchData:', error);
        toast({
          title: "Error",
          description: "Failed to fetch data. Please try again.",
          variant: "destructive",
        });
      }
    };

    if (!isSessionLoading && session) {
      fetchData();
    }
  }, [userClients, selectedClient, selectedPlatform, selectedCategory, selectedStatus, session, isSessionLoading]);

  const fetchOptimizations = async () => {
    try {
      if (!session) {
        navigate("/login");
        return;
      }

      // First, fetch optimizations
      const { data: optimizations, error: optimizationsError } = await supabase
        .from('optimizations')
        .select('*')
        .in('client', userClients);

      if (optimizationsError) throw optimizationsError;

      if (optimizations) {
        // Then, fetch profiles for the user_ids
        const userIds = [...new Set(optimizations.map(opt => opt.user_id))];
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, first_name')
          .in('id', userIds);

        if (profilesError) throw profilesError;

        // Create a map of user_id to first_name for quick lookup
        const profileMap = (profiles || []).reduce((acc: {[key: string]: string | null}, profile) => {
          acc[profile.id] = profile.first_name;
          return acc;
        }, {});

        // Transform the data to include user_first_name at the top level
        const transformedOptimizations = optimizations.map(opt => ({
          ...opt,
          user_first_name: profileMap[opt.user_id] || null
        }));

        // Apply filters
        const filteredOptimizations = transformedOptimizations.filter(opt => {
          const clientMatch = !selectedClient || opt.client === selectedClient;
          const platformMatch = !selectedPlatform || opt.platform === selectedPlatform;
          const categoryMatch = !selectedCategory || opt.categories.includes(selectedCategory);
          const statusMatch = !selectedStatus || opt.status === selectedStatus;
          return clientMatch && platformMatch && categoryMatch && statusMatch;
        });

        // Group optimizations by client
        const grouped = filteredOptimizations.reduce((acc: OptimizationsByClient, curr) => {
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

  if (isSessionLoading) {
    return <div>Loading...</div>;
  }

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
          selectedStatus={selectedStatus}
          onClientChange={setSelectedClient}
          onPlatformChange={setSelectedPlatform}
          onCategoryChange={setSelectedCategory}
          onStatusChange={setSelectedStatus}
          clients={userClients}
          visibleColumns={visibleColumns}
          onColumnToggle={handleColumnToggle}
          columnDefinitions={columnDefinitions}
        />

        {Object.entries(optimizationsByClient).map(([client, optimizations]) => (
          <ClientSection
            key={client}
            client={client}
            optimizations={optimizations}
            onStatusChange={handleStatusChange}
            visibleColumns={visibleColumns}
          />
        ))}
      </main>
    </div>
  );
};

export default Dashboard;
