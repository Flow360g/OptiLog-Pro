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
        // First, delete all existing client selections for this user
        const { error: deleteError } = await supabase
          .from('user_clients')
          .delete()
          .eq('user_id', userId)
          .throwOnError();

        if (deleteError) {
          console.error('Error deleting existing clients:', deleteError);
          throw deleteError;
        }

        if (selectedClients.length > 0) {
          // Use upsert to handle potential duplicates
          const { error: upsertError } = await supabase
            .from('user_clients')
            .upsert(
              selectedClients.map(client => ({
                user_id: userId,
                client
              })),
              { 
                onConflict: 'user_id,client',
                ignoreDuplicates: true 
              }
            )
            .throwOnError();

          if (upsertError) {
            console.error('Error upserting clients:', upsertError);
            throw upsertError;
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