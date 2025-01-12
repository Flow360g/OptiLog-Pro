import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export function useUserClients() {
  const navigate = useNavigate();
  const { toast } = useToast();

  return useQuery({
    queryKey: ['userClients'],
    queryFn: async () => {
      // First check if we have a valid session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        navigate('/login');
        return [];
      }

      if (!session) {
        console.log('No active session found');
        navigate('/login');
        return [];
      }

      try {
        const { data: userClients, error } = await supabase
          .from('user_clients')
          .select('client')
          .eq('user_id', session.user.id);

        if (error) {
          console.error('Error fetching user clients:', error);
          toast({
            title: "Error",
            description: "Failed to fetch user clients. Please try again.",
            variant: "destructive",
          });
          return [];
        }

        return userClients?.map(uc => uc.client) || [];
      } catch (error) {
        console.error('Unexpected error:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
        return [];
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  });
}