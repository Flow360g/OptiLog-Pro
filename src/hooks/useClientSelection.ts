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

      // First, delete all existing client associations
      const { error: deleteError } = await supabase
        .from('user_clients')
        .delete()
        .eq('user_id', userId);

      if (deleteError) {
        console.error("Delete clients error:", deleteError);
        throw new Error("Failed to update client selections");
      }

      // Then, insert the new selections if there are any
      if (selectedClients.length > 0) {
        const { error: insertError } = await supabase
          .from('user_clients')
          .insert(
            selectedClients.map(client => ({
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