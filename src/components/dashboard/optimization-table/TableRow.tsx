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

  const columnMap = {
    priority: {
      width: "w-20",
      content: <td className="p-4 text-gray-700 font-medium w-20">{index + 1}</td>
    },
    campaign: {
      width: "w-48",
      content: <td className="p-4 text-gray-700 w-48">{opt.campaign_name}</td>
    },
    platform: {
      width: "w-24",
      content: (
        <td className="p-4 w-24">
          <div className="flex justify-center">
            <PlatformIcon platform={opt.platform} />
          </div>
        </td>
      )
    },
    kpi: {
      width: "w-32",
      content: <td className="p-4 text-gray-700 w-32">{opt.kpi}</td>
    },
    action: {
      width: "w-64",
      content: <td className="p-4 text-gray-700 w-64">{opt.recommended_action}</td>
    },
    categories: {
      width: "w-48",
      content: (
        <td className="p-4 w-48">
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
      )
    },
    date: {
      width: "w-32",
      content: (
        <td className="p-4 text-gray-700 w-32">
          {format(new Date(opt.optimization_date), "MMM d, yyyy")}
        </td>
      )
    },
    added_by: {
      width: "w-32",
      content: <td className="p-4 text-gray-700 w-32">{opt.user_first_name || 'Unknown'}</td>
    },
    effort: {
      width: "w-24",
      content: <td className="p-4 text-gray-700 w-24">{opt.effort_level}</td>
    },
    impact: {
      width: "w-24",
      content: <td className="p-4 text-gray-700 w-24">{opt.impact_level}</td>
    },
    status: {
      width: "w-32",
      content: (
        <td className="p-4 text-gray-700 w-32">
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
      )
    }
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      {visibleColumns.map((column) => columnMap[column as keyof typeof columnMap].content)}
    </tr>
  );
}