import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { OptimizationsByClient } from "@/types/optimization";
import { Session } from "@supabase/auth-helpers-react";

export function useDashboardData(
  userClients: string[],
  selectedClient: string | null,
  selectedPlatform: string | null,
  selectedCategory: string | null,
  selectedStatus: string | null,
  session: Session | null,
  setOptimizationsByClient: (value: OptimizationsByClient) => void
) {
  const { toast } = useToast();

  const fetchOptimizations = async () => {
    try {
      if (!session) return;

      const { data: optimizations, error: optimizationsError } = await supabase
        .from('optimizations')
        .select('*')
        .in('client', userClients);

      if (optimizationsError) throw optimizationsError;

      if (optimizations) {
        const userIds = [...new Set(optimizations.map(opt => opt.user_id))];
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, first_name')
          .in('id', userIds);

        if (profilesError) throw profilesError;

        const profileMap = (profiles || []).reduce((acc: {[key: string]: string | null}, profile) => {
          acc[profile.id] = profile.first_name;
          return acc;
        }, {});

        const transformedOptimizations = optimizations.map(opt => ({
          ...opt,
          user_first_name: profileMap[opt.user_id] || null
        }));

        const filteredOptimizations = transformedOptimizations.filter(opt => {
          const clientMatch = !selectedClient || opt.client === selectedClient;
          const platformMatch = !selectedPlatform || opt.platform === selectedPlatform;
          const categoryMatch = !selectedCategory || opt.categories.includes(selectedCategory);
          const statusMatch = !selectedStatus || opt.status === selectedStatus;
          return clientMatch && platformMatch && categoryMatch && statusMatch;
        });

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

  useEffect(() => {
    if (userClients.length > 0) {
      fetchOptimizations();
    }
  }, [userClients, selectedClient, selectedPlatform, selectedCategory, selectedStatus, session]);

  return { fetchOptimizations };
}