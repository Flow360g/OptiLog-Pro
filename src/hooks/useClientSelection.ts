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
      const { error } = await supabase
        .rpc('update_user_clients', {
          p_user_id: userId,
          p_clients: selectedClients as unknown as string[]
        })
        .throwOnError();

      if (error) {
        console.error('Error updating user clients:', error);
        throw error;
      }

      return selectedClients;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userClients'] });
      toast.success('Client selections updated successfully');
    },
    onError: (error) => {
      console.error('Error in mutation:', error);
      toast.error('Failed to update client selections');
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