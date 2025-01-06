import { Navigation } from "@/components/Navigation";
import { FilterSection } from "@/components/dashboard/FilterSection";
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useUserClients } from "@/hooks/useUserClients";
import { useNavigate } from "react-router-dom";
import { ClientSection } from "@/components/dashboard/ClientSection";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { useDashboardState } from "@/components/dashboard/DashboardState";
import { useDashboardData } from "@/components/dashboard/useDashboardData";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { session, isLoading: isSessionLoading } = useSessionContext();
  const { data: userClients = [] } = useUserClients();
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

  const handleDownload = () => {
    // Prepare the data for CSV
    const rows = [];
    
    // Add header row
    const headers = ['Client', 'Campaign', 'Platform', 'KPI', 'Action', 'Categories', 
                    'Date', 'Added By', 'Effort', 'Impact', 'Status'];
    rows.push(headers.join(','));

    // Add data rows
    Object.entries(optimizationsByClient).forEach(([client, optimizations]) => {
      optimizations.forEach(opt => {
        const row = [
          client,
          opt.campaign_name,
          opt.platform,
          opt.kpi,
          `"${opt.recommended_action.replace(/"/g, '""')}"`, // Escape quotes in action text
          `"${opt.categories.join(', ')}"`,
          opt.optimization_date,
          opt.user_first_name,
          opt.effort_level,
          opt.impact_level,
          opt.status
        ];
        rows.push(row.join(','));
      });
    });

    // Create and download the CSV file
    const csvContent = rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `optimizations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Success",
      description: "Optimizations data downloaded successfully",
      duration: 2000,
    });
  };

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
          duration: 2000, // Auto dismiss after 2 seconds
        });
        
        // Delay the data refresh by 1 second to allow the confetti animation to complete
        setTimeout(() => {
          fetchOptimizations();
        }, 1000);
      } else {
        // For other status changes, refresh immediately
        fetchOptimizations();
      }
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
    return <LoadingState />;
  }

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
            onDownload={handleDownload}
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
