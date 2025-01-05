import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Navigation } from "@/components/Navigation";
import { ProfileForm } from "@/components/settings/ProfileForm";
import { ClientSelector } from "@/components/settings/ClientSelector";

type UserPosition = Database['public']['Enums']['user_position'];

export default function UserSettings() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [position, setPosition] = useState<UserPosition | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/login");
          return;
        }

        setEmail(user.email || "");

        // Load profile data
        const { data: profile } = await supabase
          .from('profiles')
          .select('position, first_name, last_name')
          .eq('id', user.id)
          .single();

        if (profile) {
          setPosition(profile.position || null);
          setFirstName(profile.first_name || '');
          setLastName(profile.last_name || '');
        }

        // Load clients
        const { data: userClients } = await supabase
          .from('user_clients')
          .select('client')
          .eq('user_id', user.id);

        if (userClients) {
          setSelectedClients(userClients.map(uc => uc.client));
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading user data:", error);
        toast.error("Failed to load user data");
      }
    };

    loadUserData();
  }, [navigate]);

  const handleSave = async () => {
    if (isSaving) return;
    
    try {
      setIsSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("No user found");
        return;
      }

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          position,
          first_name: firstName,
          last_name: lastName
        })
        .eq('id', user.id);

      if (profileError) {
        console.error("Profile update error:", profileError);
        toast.error("Failed to update profile");
        return;
      }

      // Get current client associations
      const { data: existingClients } = await supabase
        .from('user_clients')
        .select('client')
        .eq('user_id', user.id);

      const currentClients = new Set(existingClients?.map(ec => ec.client) || []);
      const newClients = selectedClients.filter(client => !currentClients.has(client));
      const clientsToRemove = Array.from(currentClients).filter(client => !selectedClients.includes(client as string));

      // Remove unselected clients
      if (clientsToRemove.length > 0) {
        const { error: deleteError } = await supabase
          .from('user_clients')
          .delete()
          .eq('user_id', user.id)
          .in('client', clientsToRemove);

        if (deleteError) {
          console.error("Delete clients error:", deleteError);
          toast.error("Failed to update client selections");
          return;
        }
      }

      // Insert only new client associations
      if (newClients.length > 0) {
        const { error: insertError } = await supabase
          .from('user_clients')
          .insert(
            newClients.map(client => ({
              user_id: user.id,
              client
            }))
          );

        if (insertError) {
          console.error("Clients insert error:", insertError);
          toast.error("Failed to save new client selections");
          return;
        }
      }

      toast.success("Settings updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navigation />
        <div className="p-8">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <Navigation />
      <div className="max-w-2xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-8">User Settings</h1>
        
        <div className="space-y-6 bg-white p-6 rounded-lg shadow">
          <ProfileForm
            email={email}
            firstName={firstName}
            lastName={lastName}
            position={position}
            onFirstNameChange={setFirstName}
            onLastNameChange={setLastName}
            onPositionChange={setPosition}
          />

          <ClientSelector
            selectedClients={selectedClients}
            onClientToggle={handleClientToggle}
          />

          <Button 
            onClick={handleSave}
            className="w-full gradient-bg"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}