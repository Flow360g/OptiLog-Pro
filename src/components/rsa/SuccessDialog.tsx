import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CheckCircle, Download } from "lucide-react";

interface SuccessDialogProps {
  open: boolean;
  onClose: () => void;
  onDownload: () => void;
}

export function SuccessDialog({ open, onClose, onDownload }: SuccessDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold text-black text-center flex items-center justify-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            Processing Complete!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-gray-700 text-lg">
            Your RSA files have been successfully processed and optimized.
          </AlertDialogDescription>
          <div className="flex justify-center mt-6">
            <Button 
              onClick={onDownload}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Results
            </Button>
          </div>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}