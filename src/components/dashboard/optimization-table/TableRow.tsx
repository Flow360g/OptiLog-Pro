import { format } from "date-fns";
import { Optimization } from "@/types/optimization";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlatformIcon } from "./PlatformIcon";
import { Check, X } from "lucide-react";

interface TableRowProps {
  optimization: Optimization;
  index: number;
  visibleColumns: string[];
  onStatusChange: (optimizationId: string, newStatus: string) => void;
}

export function TableRow({ optimization: opt, index, visibleColumns, onStatusChange }: TableRowProps) {
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

  const renderCell = (column: string) => {
    switch (column) {
      case 'priority':
        return <td className="p-4 text-gray-700 font-medium">{index + 1}</td>;
      case 'campaign':
        return <td className="p-4 text-gray-700">{opt.campaign_name}</td>;
      case 'platform':
        return (
          <td className="p-4">
            <div className="flex justify-center">
              <PlatformIcon platform={opt.platform} />
            </div>
          </td>
        );
      case 'kpi':
        return <td className="p-4 text-gray-700">{opt.kpi}</td>;
      case 'action':
        return <td className="p-4 text-gray-700">{opt.recommended_action}</td>;
      case 'categories':
        return (
          <td className="p-4">
            <div className="flex flex-wrap gap-1">
              {opt.categories.map((category, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  {category}
                </span>
              ))}
            </div>
          </td>
        );
      case 'date':
        return (
          <td className="p-4 text-gray-700">
            {format(new Date(opt.optimization_date), "MMM d, yyyy")}
          </td>
        );
      case 'added_by':
        return <td className="p-4 text-gray-700">{opt.user_first_name || 'Unknown'}</td>;
      case 'effort':
        return <td className="p-4 text-gray-700">{opt.effort_level}</td>;
      case 'impact':
        return <td className="p-4 text-gray-700">{opt.impact_level}</td>;
      case 'status':
        return (
          <td className="p-4 text-gray-700">
            <Select
              value={opt.status || "Pending"}
              onValueChange={(value) => onStatusChange(opt.id, value)}
            >
              <SelectTrigger className={`w-[130px] ${getStatusStyles(opt.status || "Pending")}`}>
                <div className="flex items-center justify-between">
                  <SelectValue />
                  {getStatusIcon(opt.status || "Pending")}
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
      default:
        return null;
    }
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      {visibleColumns.map((column) => renderCell(column))}
    </tr>
  );
}