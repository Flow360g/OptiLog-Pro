import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useClientSelection(initialClients: string[] = []) {
  const [selectedClients, setSelectedClients] = useState<string[]>(initialClients);
  const queryClient = useQueryClient();

  // Synchronize local state with prop changes
  useEffect(() => {
    setSelectedClients(initialClients);
  }, [initialClients]);

  const handleClientToggle = (client: string) => {
    setSelectedClients(prev => 
      prev.includes(client) 
        ? prev.filter(c => c !== client)
        : [...prev, client]
    );
  };

  const { mutateAsync: saveClientSelections, isPending: isSaving } = useMutation({
    mutationFn: async (userId: string) => {
      // Get current client selections
      const { data: currentSelections } = await supabase
        .from('user_clients')
        .select('client')
        .eq('user_id', userId);

      const currentClients = new Set(currentSelections?.map(s => s.client) || []);
      const newClients = new Set(selectedClients);

      // Determine which clients to add and remove
      const clientsToAdd = selectedClients.filter(client => !currentClients.has(client));
      const clientsToRemove = Array.from(currentClients).filter(client => !newClients.has(client));

      // Remove unselected clients
      if (clientsToRemove.length > 0) {
        const { error: deleteError } = await supabase
          .from('user_clients')
          .delete()
          .eq('user_id', userId)
          .in('client', clientsToRemove);

        if (deleteError) throw deleteError;
      }

      // Add newly selected clients
      if (clientsToAdd.length > 0) {
        const { error: insertError } = await supabase
          .from('user_clients')
          .insert(
            clientsToAdd.map(client => ({
              user_id: userId,
              client
            }))
          );

        if (insertError) throw insertError;
      }

      return selectedClients;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userClients'] });
    }
  });

  return {
    selectedClients,
    setSelectedClients,
    handleClientToggle,
    saveClientSelections,
    isSaving
  };
}