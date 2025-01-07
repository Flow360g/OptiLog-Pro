import { useSessionContext } from '@supabase/auth-helpers-react';
import { useUserClients } from "@/hooks/useUserClients";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { ClientSection } from "@/components/dashboard/ClientSection";
import { useDashboardState } from "@/components/dashboard/DashboardState";
import { useDashboardData } from "@/components/dashboard/useDashboardData";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { FilterSection } from "@/components/dashboard/FilterSection";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  { key: "status", label: "Status" }
];

const Dashboard = () => {
  const { session, isLoading: isSessionLoading } = useSessionContext();
  const navigate = useNavigate();
  const { data: userClients = [], isLoading: isClientsLoading } = useUserClients();
  const {
    selectedClient,
    selectedPlatform,
    selectedCategory,
    selectedStatus,
    optimizationsByClient,
    setOptimizationsByClient,
    visibleColumns,
    handleColumnToggle,
    setSelectedClient,
    setSelectedPlatform,
    setSelectedCategory,
    setSelectedStatus,
  } = useDashboardState();

  useEffect(() => {
    if (!isSessionLoading && !session) {
      navigate('/login');
    }
  }, [session, isSessionLoading, navigate]);

  const { fetchOptimizations } = useDashboardData(
    userClients,
    selectedClient,
    selectedPlatform,
    selectedCategory,
    selectedStatus,
    session,
    setOptimizationsByClient
  );

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
    }
  };

  if (isSessionLoading || isClientsLoading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <DashboardHeader />
        <div className="mb-8">
          <FilterSection
            clients={userClients}
            selectedClient={selectedClient}
            selectedPlatform={selectedPlatform}
            selectedCategory={selectedCategory}
            selectedStatus={selectedStatus}
            onClientChange={setSelectedClient}
            onPlatformChange={setSelectedPlatform}
            onCategoryChange={setSelectedCategory}
            onStatusChange={setSelectedStatus}
            visibleColumns={visibleColumns}
            onColumnToggle={handleColumnToggle}
            columnDefinitions={columnDefinitions}
          />
        </div>
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