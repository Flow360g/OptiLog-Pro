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
      // Delete all existing client selections
      const { error: deleteError } = await supabase
        .from('user_clients')
        .delete()
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      // Only insert if there are selected clients
      if (selectedClients.length > 0) {
        const { error: insertError } = await supabase
          .from('user_clients')
          .insert(
            selectedClients.map(client => ({
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
    saveClientSelections: mutation.mutateAsync,
    isSaving: mutation.isPending
  };
}