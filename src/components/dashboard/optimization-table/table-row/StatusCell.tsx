import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, X, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import Confetti from 'react-confetti';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface StatusCellProps {
  status: string;
  optimizationId: string;
  onStatusChange: (optimizationId: string, newStatus: string) => void;
}

export function StatusCell({ status, optimizationId, onStatusChange }: StatusCellProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);

  const handleStatusChange = (newStatus: string) => {
    if (newStatus === 'Completed') {
      setPendingStatus(newStatus);
      setShowSuccessDialog(true);
    } else {
      onStatusChange(optimizationId, newStatus);
    }
  };

  const handleSuccessConfirm = (wasSuccessful: boolean) => {
    setShowSuccessDialog(false);
    if (pendingStatus) {
      onStatusChange(optimizationId, pendingStatus);
      if (wasSuccessful) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }
    setPendingStatus(null);
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-500 text-white';
      case 'Disapproved':
        return 'bg-red-500 text-white';
      case 'Completed':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <Check className="h-4 w-4 ml-2" />;
      case 'Disapproved':
        return <X className="h-4 w-4 ml-2" />;
      case 'Completed':
        return <CheckCircle2 className="h-4 w-4 ml-2" />;
      default:
        return null;
    }
  };

  return (
    <td className="p-4 text-gray-700 w-32 relative">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}
      
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Was this optimization successful?</AlertDialogTitle>
            <AlertDialogDescription>
              Your response helps us improve our optimization suggestions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => handleSuccessConfirm(false)}
            >
              No
            </Button>
            <Button
              onClick={() => handleSuccessConfirm(true)}
            >
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Select
        value={status || "Pending"}
        onValueChange={handleStatusChange}
      >
        <SelectTrigger className={`w-[130px] ${getStatusStyles(status || "Pending")}`}>
          <div className="flex items-center justify-between">
            <SelectValue />
            {getStatusIcon(status || "Pending")}
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Pending">Pending</SelectItem>
          <SelectItem value="Approved">Approved</SelectItem>
          <SelectItem value="Disapproved">Disapproved</SelectItem>
          <SelectItem value="Completed">Completed</SelectItem>
        </SelectContent>
      </Select>
    </td>
  );
}