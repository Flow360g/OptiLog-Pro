import { AlertCircle, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface NotificationItemProps {
  id: string;
  message: string;
  onDismiss: (id: string) => void;
}

export const NotificationItem = ({ id, message, onDismiss }: NotificationItemProps) => {
  return (
    <Alert className="relative bg-white border-l-4 border-l-primary">
      <AlertCircle className="h-4 w-4 text-primary" />
      <AlertDescription className="pr-8">{message}</AlertDescription>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 hover:bg-gray-100"
        onClick={() => onDismiss(id)}
      >
        <X className="h-4 w-4" />
      </Button>
    </Alert>
  );
};