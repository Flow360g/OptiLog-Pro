import { useSessionContext } from '@supabase/auth-helpers-react';
import { useUserClients } from "@/hooks/useUserClients";
import { useNavigate } from "react-router-dom";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { OptimizationTable } from "@/components/dashboard/OptimizationTable";
import { useDashboardState } from "@/components/dashboard/DashboardState";
import { useDashboardData } from "@/components/dashboard/useDashboardData";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { FilterSection } from "@/components/dashboard/FilterSection";
import { useEffect } from "react";

const Dashboard = () => {
  const { session, isLoading: isSessionLoading } = useSessionContext();
  const navigate = useNavigate();
  const { clients, isLoading: isClientsLoading } = useUserClients();
  const {
    selectedClient,
    selectedPlatform,
    selectedDateRange,
    selectedStatus,
    selectedCategories,
    visibleColumns,
    setSelectedClient,
    setSelectedPlatform,
    setSelectedDateRange,
    setSelectedStatus,
    setSelectedCategories,
    handleColumnToggle
  } = useDashboardState();

  useEffect(() => {
    if (!isSessionLoading && !session) {
      navigate('/login');
    }
  }, [session, isSessionLoading, navigate]);

  const {
    data: optimizations,
    isLoading: isOptimizationsLoading,
    error
  } = useDashboardData({
    client: selectedClient,
    platform: selectedPlatform,
    dateRange: selectedDateRange,
    status: selectedStatus,
    categories: selectedCategories,
  });

  if (isSessionLoading || isClientsLoading || isOptimizationsLoading) {
    return <LoadingState />;
  }

  if (error) {
    console.error('Dashboard error:', error);
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Error loading dashboard data</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <DashboardHeader />
        <FilterSection
          clients={clients || []}
          selectedClient={selectedClient}
          setSelectedClient={setSelectedClient}
          selectedPlatform={selectedPlatform}
          setSelectedPlatform={setSelectedPlatform}
          selectedDateRange={selectedDateRange}
          setSelectedDateRange={setSelectedDateRange}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />
        <OptimizationTable
          optimizations={optimizations || []}
          visibleColumns={visibleColumns}
          handleColumnToggle={handleColumnToggle}
        />
      </main>
    </div>
  );
};

export default Dashboard;