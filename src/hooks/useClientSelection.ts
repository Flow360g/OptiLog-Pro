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
        // First, delete all existing client selections for this user
        const { error: deleteError } = await supabase
          .from('user_clients')
          .delete()
          .eq('user_id', userId);

        if (deleteError) throw deleteError;

        // Wait a moment to ensure deletion is complete
        await new Promise(resolve => setTimeout(resolve, 100));

        // Then, insert new selections if there are any
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