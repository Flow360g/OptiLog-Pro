import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Test } from "../types";

interface StatusSelectProps {
  status: Test['status'];
  onStatusChange: (newStatus: Test['status']) => void;
}

export function StatusSelect({ status, onStatusChange }: StatusSelectProps) {
  const getStatusLabel = (status: Test['status']) => {
    switch (status) {
      case 'draft': return 'Planning';
      case 'in_progress': return 'Working on it';
      case 'completed': return 'Live';
      case 'cancelled': return 'Completed';
      default: return status;
    }
  };

  const getStatusStyles = (status: Test['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 text-white hover:bg-green-600';
      case 'in_progress':
        return 'bg-blue-500 text-white hover:bg-blue-600';
      case 'draft':
        return 'bg-gray-100 hover:bg-gray-200';
      case 'cancelled':
        return 'bg-gray-500 text-white hover:bg-gray-600';
      default:
        return '';
    }
  };

  return (
    <Select
      value={status}
      onValueChange={onStatusChange}
    >
      <SelectTrigger className={`w-[140px] ${getStatusStyles(status)}`}>
        <SelectValue>
          {getStatusLabel(status)}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="draft">Planning</SelectItem>
        <SelectItem value="in_progress">Working on it</SelectItem>
        <SelectItem value="completed">Live</SelectItem>
        <SelectItem value="cancelled">Completed</SelectItem>
      </SelectContent>
    </Select>
  );
}