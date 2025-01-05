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
        // First, get existing selections
        const { data: existingSelections, error: fetchError } = await supabase
          .from('user_clients')
          .select('client')
          .eq('user_id', userId);

        if (fetchError) throw fetchError;

        const existingClients = existingSelections?.map(s => s.client) || [];
        
        // Find clients to delete (ones that exist but aren't in selectedClients)
        const clientsToDelete = existingClients.filter(
          client => !selectedClients.includes(client)
        );

        // Find clients to add (ones in selectedClients but don't exist yet)
        const clientsToAdd = selectedClients.filter(
          client => !existingClients.includes(client)
        );

        // Delete removed clients
        if (clientsToDelete.length > 0) {
          const { error: deleteError } = await supabase
            .from('user_clients')
            .delete()
            .eq('user_id', userId)
            .in('client', clientsToDelete);

          if (deleteError) throw deleteError;
        }

        // Add new clients
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