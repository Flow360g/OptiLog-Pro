import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
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

interface DeleteAccountButtonProps {
  userId: string;
}

export function DeleteAccountButton({ userId }: DeleteAccountButtonProps) {
  const navigate = useNavigate();

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
  );
}