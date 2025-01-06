import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useProfileData } from "./useProfileData";
import { useClientSelection } from "./useClientSelection";

export function useSettingsForm(userId: string, userClients: string[]) {
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
      // Save profile data first
      await saveProfileData(userId);

      // Save client selections
      await saveClientSelections(userId);
      
      // Invalidate queries to refresh the data
      await queryClient.invalidateQueries({ queryKey: ['userClients'] });
      
      toast.success("Settings updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("An unexpected error occurred");
    }
  };

  return {
    email,
    firstName,
    lastName,
    position,
    isProfileSaving,
    setFirstName,
    setLastName,
    setPosition,
    selectedClients,
    handleClientToggle,
    isClientSaving,
    handleSave
  };
}