import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "@/data/optimizationData";

interface FilterSectionProps {
  selectedClient: string | null;
  selectedPlatform: string | null;
  selectedCategory: string | null;
  onClientChange: (value: string | null) => void;
  onPlatformChange: (value: string | null) => void;
  onCategoryChange: (value: string | null) => void;
  clients: string[];
}

export function FilterSection({
  selectedClient,
  selectedPlatform,
  selectedCategory,
  onClientChange,
  onPlatformChange,
  onCategoryChange,
  clients,
}: FilterSectionProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="w-48">
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

      <div className="w-48">
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

      <div className="w-48">
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

      <Button
        variant="outline"
        onClick={() => {
          onClientChange(null);
          onPlatformChange(null);
          onCategoryChange(null);
        }}
        className="bg-white"
      >
        Clear Filters
      </Button>
    </div>
  );
}