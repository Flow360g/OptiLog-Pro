import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { FilterButtons } from "./filter-section/FilterButtons";
import { FilterContent } from "./filter-section/FilterContent";
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
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <FilterButtons
              onDownload={onDownload}
              visibleColumns={visibleColumns}
              onColumnToggle={onColumnToggle}
              columnDefinitions={columnDefinitions}
            />
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <FilterContent
              selectedClient={selectedClient}
              selectedPlatform={selectedPlatform}
              selectedCategory={selectedCategory}
              selectedStatus={selectedStatus}
              onClientChange={onClientChange}
              onPlatformChange={onPlatformChange}
              onCategoryChange={onCategoryChange}
              onStatusChange={onStatusChange}
              clients={clients}
            />
          </PopoverContent>
        </Popover>

        {columnDefinitions && visibleColumns && onColumnToggle && (
          <ColumnSelector
            columns={columnDefinitions}
            visibleColumns={visibleColumns}
            onColumnToggle={onColumnToggle}
          />
        )}
      </div>

      {onDownload && (
        <Button
          onClick={onDownload}
          variant="outline"
          className="bg-white ml-auto"
        >
          <Download className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Download CSV</span>
        </Button>
      )}
    </div>
  );
}