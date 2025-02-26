import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { categories } from "@/data/optimizationData";

interface FilterContentProps {
  selectedClient: string | null;
  selectedPlatform: string | null;
  selectedCategory: string | null;
  selectedStatus: string | null;
  onClientChange: (value: string | null) => void;
  onPlatformChange: (value: string | null) => void;
  onCategoryChange: (value: string | null) => void;
  onStatusChange: (value: string | null) => void;
  clients: string[];
}

export function FilterContent({
  selectedClient,
  selectedPlatform,
  selectedCategory,
  selectedStatus,
  onClientChange,
  onPlatformChange,
  onCategoryChange,
  onStatusChange,
  clients,
}: FilterContentProps) {
  return (
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
  );
}