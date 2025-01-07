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
  const { data: userClients = [], isLoading: isClientsLoading } = useUserClients();
  const {
    selectedClient,
    selectedPlatform,
    selectedStatus,
    visibleColumns,
    setSelectedClient,
    setSelectedPlatform,
    setSelectedStatus,
    handleColumnToggle
  } = useDashboardState();

  useEffect(() => {
    if (!isSessionLoading && !session) {
      navigate('/login');
    }
  }, [session, isSessionLoading, navigate]);

  const { fetchOptimizations, optimizationsByClient } = useDashboardData(
    userClients || [],
    selectedClient,
    selectedPlatform,
    null, // category
    selectedStatus,
    session,
    () => {} // setOptimizationsByClient is handled internally
  );

  if (isSessionLoading || isClientsLoading) {
    return <LoadingState />;
  }

  const optimizations = Object.values(optimizationsByClient || {}).flat();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <DashboardHeader />
        <FilterSection
          clients={userClients}
          selectedClient={selectedClient}
          selectedPlatform={selectedPlatform}
          selectedCategory={null}
          selectedStatus={selectedStatus}
          onClientChange={setSelectedClient}
          onPlatformChange={setSelectedPlatform}
          onCategoryChange={() => {}}
          onStatusChange={setSelectedStatus}
          visibleColumns={visibleColumns}
          onColumnToggle={handleColumnToggle}
        />
        <OptimizationTable
          optimizations={optimizations}
          onStatusChange={() => {}}
          visibleColumns={visibleColumns}
        />
      </main>
    </div>
  );
};

export default Dashboard;