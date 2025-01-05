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

  const mutation = useMutation({
    mutationFn: async (userId: string) => {
      try {
        // Start a transaction by getting the connection
        const { data: existingSelections, error: fetchError } = await supabase
          .from('user_clients')
          .select('client')
          .eq('user_id', userId);

        if (fetchError) throw fetchError;

        // Delete only the clients that are no longer selected
        const clientsToDelete = existingSelections
          ?.map(s => s.client)
          .filter(client => !selectedClients.includes(client)) || [];

        if (clientsToDelete.length > 0) {
          const { error: deleteError } = await supabase
            .from('user_clients')
            .delete()
            .eq('user_id', userId)
            .in('client', clientsToDelete);

          if (deleteError) throw deleteError;
        }

        // Insert only new selections that don't exist yet
        const existingClientSet = new Set(existingSelections?.map(s => s.client) || []);
        const newSelections = selectedClients.filter(client => !existingClientSet.has(client));

        if (newSelections.length > 0) {
          const { error: insertError } = await supabase
            .from('user_clients')
            .insert(
              newSelections.map(client => ({
                user_id: userId,
                client
              }))
            );

          if (insertError) throw insertError;
        }

        return selectedClients;
      } catch (error) {
        console.error('Error in mutation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userClients'] });
    }
  });

  return {
    selectedClients,
    setSelectedClients,
    handleClientToggle,
    saveClientSelections: mutation.mutateAsync,
    isSaving: mutation.isPending
  };
}