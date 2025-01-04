import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SuccessDialog({ open, onOpenChange }: SuccessDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold text-black text-center">
            Nice work! 🎉 👏
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-gray-700 text-lg">
            Your optimisation has been successfully logged and is ready for approval. Your team has been notified.
          </AlertDialogDescription>
          <div className="flex justify-center space-x-4 mt-6">
            <Button className="gradient-bg">
              Create New Opti
            </Button>
            <Button 
              variant="outline" 
              className="border-2 border-[#000080] text-[#000080] bg-transparent hover:bg-[#000080] hover:text-white transition-colors"
            >
              Back to Dashboard
            </Button>
          </div>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}