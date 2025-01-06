import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Filter, Settings2, Download } from "lucide-react";
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
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </Button>
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
        <Button variant="ghost" size="sm" className="flex items-center gap-2" onClick={() => {
          const dropdownTrigger = document.querySelector('[data-column-selector-trigger]');
          if (dropdownTrigger instanceof HTMLElement) {
            dropdownTrigger.click();
          }
        }}>
          <Settings2 className="h-4 w-4" />
          <span>Customise Columns</span>
        </Button>
      )}

      {onDownload && (
        <Button
          onClick={onDownload}
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          <span>Download CSV</span>
        </Button>
      )}

      {/* Hidden ColumnSelector that's controlled by the Customise Columns button */}
      {columnDefinitions && visibleColumns && onColumnToggle && (
        <div className="hidden">
          <ColumnSelector
            columns={columnDefinitions}
            visibleColumns={visibleColumns}
            onColumnToggle={onColumnToggle}
            triggerProps={{ "data-column-selector-trigger": true }}
          />
        </div>
      )}
    </div>
  );
}