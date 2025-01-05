import { format } from "date-fns";
import { Optimization } from "@/types/optimization";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Facebook, Globe } from "lucide-react";

interface TableRowProps {
  optimization: Optimization;
  index: number;
  onStatusChange: (optimizationId: string, newStatus: string) => void;
}

export function TableRow({ optimization: opt, index, onStatusChange }: TableRowProps) {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-[#0FA0CE] text-white';
      case 'Disapproved':
        return 'bg-[#ea384c] text-white';
      default:
        return 'bg-white';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return <Facebook className="w-5 h-5 text-[#1877F2]" />;
      case 'google':
        return <Globe className="w-5 h-5 text-[#4285F4]" />;
      default:
        return <Globe className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <td className="p-4 text-gray-700 font-medium">{index + 1}</td>
      <td className="p-4 text-gray-700">{opt.campaign_name}</td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          {getPlatformIcon(opt.platform)}
          <span className="text-gray-700">{opt.platform}</span>
        </div>
      </td>
      <td className="p-4 text-gray-700">{opt.kpi}</td>
      <td className="p-4 text-gray-700">{opt.recommended_action}</td>
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
      <td className="p-4 text-gray-700">
        {format(new Date(opt.optimization_date), "MMM d, yyyy")}
      </td>
      <td className="p-4 text-gray-700">{opt.user_first_name || 'Unknown'}</td>
      <td className="p-4 text-gray-700">{opt.effort_level}</td>
      <td className="p-4 text-gray-700">{opt.impact_level}</td>
      <td className="p-4 text-gray-700">
        <Select
          value={opt.status || "Pending"}
          onValueChange={(value) => onStatusChange(opt.id, value)}
        >
          <SelectTrigger className={`w-[130px] ${getStatusStyles(opt.status || "Pending")}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Disapproved">Disapproved</SelectItem>
          </SelectContent>
        </Select>
      </td>
    </tr>
  );
}