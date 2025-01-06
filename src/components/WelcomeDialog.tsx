import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface WelcomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WelcomeDialog({ open, onOpenChange }: WelcomeDialogProps) {
  const navigate = useNavigate();

  const handleDialogClose = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Update the profile to mark that they've seen the welcome dialog
        await supabase
          .from('profiles')
          .update({ has_seen_welcome: true })
          .eq('id', user.id);
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      onOpenChange(false);
    }
  };

  const handleSettingsClick = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Update the profile to mark that they've seen the welcome dialog
        await supabase
          .from('profiles')
          .update({ has_seen_welcome: true })
          .eq('id', user.id);
      }
      navigate("/settings");
    } catch (error) {
      console.error("Error updating profile:", error);
      navigate("/settings");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-md">
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        <DialogHeader>
          <DialogTitle>Welcome to OptiLog Pro!</DialogTitle>
          <DialogDescription>
            To get started, please update your name, position & client selection in 'User Settings'.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center mt-6">
          <Button onClick={handleSettingsClick} className="w-full sm:w-auto gradient-bg">
            User Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}