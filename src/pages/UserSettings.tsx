import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Navigation } from "@/components/Navigation";
import { ProfileForm } from "@/components/settings/ProfileForm";
import { ClientSelector } from "@/components/settings/ClientSelector";
import { useClientSelection } from "@/hooks/useClientSelection";
import { useSessionContext } from '@supabase/auth-helpers-react';

type UserPosition = Database['public']['Enums']['user_position'];

export default function UserSettings() {
  const navigate = useNavigate();
  const { session, isLoading: isSessionLoading } = useSessionContext();
  const [email, setEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [position, setPosition] = useState<UserPosition | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const { 
    selectedClients, 
    setSelectedClients, 
    handleClientToggle,
    saveClientSelections,
    isSaving: isClientSaving 
  } = useClientSelection([]);

  // Check session and redirect if not logged in
  useEffect(() => {
    if (!isSessionLoading && !session) {
      navigate("/login");
      return;
    }
  }, [session, isSessionLoading, navigate]);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (!session) {
          navigate("/login");
          return;
        }

        setEmail(session.user.email || "");

        // Load profile data
        const { data: profile } = await supabase
          .from('profiles')
          .select('position, first_name, last_name')
          .eq('id', session.user.id)
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
          .eq('user_id', session.user.id);

        if (userClients) {
          setSelectedClients(userClients.map(uc => uc.client));
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading user data:", error);
        toast.error("Failed to load user data");
      }
    };

    if (!isSessionLoading && session) {
      loadUserData();
    }
  }, [navigate, setSelectedClients, session, isSessionLoading]);

  const handleSave = async () => {
    if (isSaving || !session) return;
    
    try {
      setIsSaving(true);

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          position,
          first_name: firstName,
          last_name: lastName
        })
        .eq('id', session.user.id);

      if (profileError) {
        console.error("Profile update error:", profileError);
        toast.error("Failed to update profile");
        return;
      }

      // Save client selections
      await saveClientSelections(session.user.id);

      toast.success("Settings updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  if (isSessionLoading || loading) {
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
            disabled={isSaving || isClientSaving}
          >
            {isSaving || isClientSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}