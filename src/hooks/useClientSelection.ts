import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useClientSelection(initialClients: string[] = []) {
  const [selectedClients, setSelectedClients] = useState<string[]>(initialClients);
  const [isSaving, setIsSaving] = useState(false);

  const handleClientToggle = (client: string) => {
    setSelectedClients(prev => 
      prev.includes(client) 
        ? prev.filter(c => c !== client)
        : [...prev, client]
    );
  };

  const saveClientSelections = async (userId: string) => {
    if (isSaving) return;
    
    try {
      setIsSaving(true);

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

        if (deleteError) {
          console.error("Delete clients error:", deleteError);
          throw new Error("Failed to update client selections");
        }
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

        if (insertError) {
          console.error("Clients insert error:", insertError);
          throw new Error("Failed to save new client selections");
        }
      }

      return true;
    } catch (error) {
      console.error("Save client selections error:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    selectedClients,
    setSelectedClients,
    handleClientToggle,
    saveClientSelections,
    isSaving
  };
}