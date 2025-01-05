import { Button } from "@/components/ui/button";
import { ProfileForm } from "./ProfileForm";
import { ClientSelector } from "./ClientSelector";
import { Database } from "@/integrations/supabase/types";
import { useClientSelection } from "@/hooks/useClientSelection";
import { useProfileData } from "@/hooks/useProfileData";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type UserPosition = Database['public']['Enums']['user_position'];

interface SettingsFormProps {
  userId: string;
  userClients: string[];
}

export function SettingsForm({ userId, userClients }: SettingsFormProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const {
    email,
    firstName,
    lastName,
    position,
    isSaving: isProfileSaving,
    setFirstName,
    setLastName,
    setPosition,
    saveProfileData
  } = useProfileData(userId);

  const { 
    selectedClients, 
    handleClientToggle,
    saveClientSelections,
    isSaving: isClientSaving 
  } = useClientSelection(userClients);

  const handleSave = async () => {
    try {
      // Save profile data
      await saveProfileData(userId);

      // Save client selections and wait for it to complete
      await saveClientSelections(userId);

      // Invalidate queries to refresh data
      await queryClient.invalidateQueries({ queryKey: ['userClients'] });
      
      toast.success("Settings updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("An unexpected error occurred");
    }
  };

  return (
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
        disabled={isProfileSaving || isClientSaving}
      >
        {isProfileSaving || isClientSaving ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  );
}