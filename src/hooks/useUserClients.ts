import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useUserClients() {
  return useQuery({
    queryKey: ['userClients'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: userClients } = await supabase
        .from('user_clients')
        .select('client')
        .eq('user_id', user.id);

      return userClients?.map(uc => uc.client) || [];
    }
  });
}