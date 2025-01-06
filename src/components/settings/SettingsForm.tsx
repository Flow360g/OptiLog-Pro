import { Button } from "@/components/ui/button";
import { ProfileForm } from "./ProfileForm";
import { ClientSelector } from "./ClientSelector";
import { Database } from "@/integrations/supabase/types";
import { useClientSelection } from "@/hooks/useClientSelection";
import { useProfileData } from "@/hooks/useProfileData";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

  const handleDeleteAccount = async () => {
    try {
      // Delete user data from our tables
      const { error: deleteOptimizationsError } = await supabase
        .from('optimizations')
        .delete()
        .eq('user_id', userId);

      if (deleteOptimizationsError) throw deleteOptimizationsError;

      const { error: deleteUserClientsError } = await supabase
        .from('user_clients')
        .delete()
        .eq('user_id', userId);

      if (deleteUserClientsError) throw deleteUserClientsError;

      const { error: deleteProfileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (deleteProfileError) throw deleteProfileError;

      // Delete the user's auth account
      const { error: deleteUserError } = await supabase.auth.admin.deleteUser(userId);
      if (deleteUserError) throw deleteUserError;

      // Sign out the user
      await supabase.auth.signOut();
      
      toast.success("Account deleted successfully");
      navigate("/login");
    } catch (error) {
      console.error("Delete account error:", error);
      toast.error("Failed to delete account");
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

      <div className="pt-6 border-t">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full">
              Delete Account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account
                and remove all your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
                Delete Account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}