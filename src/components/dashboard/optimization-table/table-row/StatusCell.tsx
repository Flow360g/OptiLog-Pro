import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, X } from "lucide-react";

interface StatusCellProps {
  status: string;
  optimizationId: string;
  onStatusChange: (optimizationId: string, newStatus: string) => void;
}

export function StatusCell({ status, optimizationId, onStatusChange }: StatusCellProps) {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-500 text-white';
      case 'Disapproved':
        return 'bg-red-500 text-white';
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
      default:
        return null;
    }
  };

  return (
    <td className="p-4 text-gray-700 w-32">
      <Select
        value={status || "Pending"}
        onValueChange={(value) => onStatusChange(optimizationId, value)}
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
        </SelectContent>
      </Select>
    </td>
  );
}