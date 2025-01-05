import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export function useUserClients() {
  const navigate = useNavigate();

  return useQuery({
    queryKey: ['userClients'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return [];
      }

      const { data: userClients, error } = await supabase
        .from('user_clients')
        .select('client');

      if (error) {
        console.error('Error fetching user clients:', error);
        return [];
      }

      return userClients?.map(uc => uc.client) || [];
    }
  });
}