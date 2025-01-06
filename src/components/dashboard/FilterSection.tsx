import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter, Settings2, Download } from "lucide-react";
import { categories } from "@/data/optimizationData";
import { ColumnSelector } from "./optimization-table/ColumnSelector";

interface FilterSectionProps {
  selectedClient: string | null;
  selectedPlatform: string | null;
  selectedCategory: string | null;
  selectedStatus: string | null;
  onClientChange: (value: string | null) => void;
  onPlatformChange: (value: string | null) => void;
  onCategoryChange: (value: string | null) => void;
  onStatusChange: (value: string | null) => void;
  clients: string[];
  visibleColumns?: string[];
  onColumnToggle?: (column: string) => void;
  columnDefinitions?: { key: string; label: string; }[];
  onDownload?: () => void;
}

export function FilterSection({
  selectedClient,
  selectedPlatform,
  selectedCategory,
  selectedStatus,
  onClientChange,
  onPlatformChange,
  onCategoryChange,
  onStatusChange,
  clients,
  visibleColumns,
  onColumnToggle,
  columnDefinitions,
  onDownload,
}: FilterSectionProps) {
  return (
    <div className="mb-6 flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="bg-white">
            <Filter className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Filters</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Client</label>
              <Select
                value={selectedClient || "all-clients"}
                onValueChange={(value) => onClientChange(value === "all-clients" ? null : value)}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Filter by Client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-clients">All Clients</SelectItem>
                  {clients.map((client) => (
                    <SelectItem key={client} value={client}>
                      {client}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Platform</label>
              <Select
                value={selectedPlatform || "all-platforms"}
                onValueChange={(value) => onPlatformChange(value === "all-platforms" ? null : value)}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Filter by Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-platforms">All Platforms</SelectItem>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                  <SelectItem value="Google">Google</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select
                value={selectedCategory || "all-categories"}
                onValueChange={(value) => onCategoryChange(value === "all-categories" ? null : value)}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-categories">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={selectedStatus || "all-statuses"}
                onValueChange={(value) => onStatusChange(value === "all-statuses" ? null : value)}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-statuses">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Disapproved">Disapproved</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              onClick={() => {
                onClientChange(null);
                onPlatformChange(null);
                onCategoryChange(null);
                onStatusChange(null);
              }}
              className="w-full bg-white"
            >
              Clear Filters
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {columnDefinitions && visibleColumns && onColumnToggle && (
        <Button variant="outline" className="bg-white">
          <Settings2 className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Customise Columns</span>
        </Button>
      )}

      {onDownload && (
        <Button
          onClick={onDownload}
          variant="outline"
          className="bg-white"
        >
          <Download className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Download CSV</span>
        </Button>
      )}
    </div>
  );
}