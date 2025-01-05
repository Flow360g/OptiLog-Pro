import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

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
        // Start a transaction
        const { error: deleteError } = await supabase
          .from('user_clients')
          .delete()
          .eq('user_id', userId)
          .throwOnError(); // This ensures the delete completes or throws

        if (deleteError) {
          console.error('Error deleting existing clients:', deleteError);
          throw deleteError;
        }

        // Wait a brief moment to ensure delete is processed
        await new Promise(resolve => setTimeout(resolve, 100));

        if (selectedClients.length > 0) {
          // Insert new records one by one to better handle potential errors
          for (const client of selectedClients) {
            const { error: insertError } = await supabase
              .from('user_clients')
              .insert({
                user_id: userId,
                client
              })
              .throwOnError();

            if (insertError) {
              console.error(`Error inserting client ${client}:`, insertError);
              throw insertError;
            }
          }
        }

        return selectedClients;
      } catch (error) {
        console.error('Error in mutation:', error);
        toast.error('Failed to update client selections');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userClients'] });
      toast.success('Client selections updated successfully');
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