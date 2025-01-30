import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useUserClients } from "@/hooks/useUserClients";
import { Navigation } from "@/components/Navigation";
import { FilterSection } from "@/components/dashboard/FilterSection";
import { ClientSection } from "@/components/dashboard/ClientSection";
import { useToast } from "@/hooks/use-toast";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { useDashboardState } from "@/components/dashboard/DashboardState";
import { useDashboardData } from "@/components/dashboard/useDashboardData";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

const Dashboard = () => {
  const navigate = useNavigate();
  const { session, isLoading: isSessionLoading } = useSessionContext();
  const { data: userClients = [], isLoading: isClientsLoading } = useUserClients();
  const { toast } = useToast();

  const {
    selectedClient,
    setSelectedClient,
    selectedPlatform,
    setSelectedPlatform,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    optimizationsByClient,
    setOptimizationsByClient,
    visibleColumns,
    handleColumnToggle
  } = useDashboardState();

  // Session check effect
  useEffect(() => {
    if (!isSessionLoading && !session) {
      navigate("/login");
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

  const handleStatusChange = async (optimizationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('optimizations')
        .update({ status: newStatus })
        .eq('id', optimizationId);

      if (error) throw error;

      if (newStatus === 'Completed') {
        toast({
          title: "Success!",
          description: "Optimization marked as completed",
          variant: "default",
          duration: 2000,
        });
      }
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

  // Only show loading state while checking session
  if (isSessionLoading) {
    return <LoadingState />;
  }

  // If no session, redirect to login
  if (!session) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <DashboardHeader />

        <div className="flex flex-wrap items-center gap-2 mb-4">
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
        </div>

        {isClientsLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading client data...</p>
          </div>
        ) : userClients.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No clients assigned. Please update your settings.</p>
          </div>
        ) : (
          Object.entries(optimizationsByClient).map(([client, optimizations]) => (
            <ClientSection
              key={client}
              client={client}
              optimizations={optimizations}
              onStatusChange={handleStatusChange}
              visibleColumns={visibleColumns}
            />
          ))
        )}
      </main>
    </div>
  );
};

export default Dashboard;