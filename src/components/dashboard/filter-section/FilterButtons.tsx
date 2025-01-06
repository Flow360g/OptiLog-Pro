import { Button } from "@/components/ui/button";
import { Filter, Settings2, Download } from "lucide-react";

interface FilterButtonsProps {
  onDownload?: () => void;
  visibleColumns?: string[];
  onColumnToggle?: (column: string) => void;
  columnDefinitions?: { key: string; label: string; }[];
}

export function FilterButtons({
  onDownload,
  visibleColumns,
  onColumnToggle,
  columnDefinitions,
}: FilterButtonsProps) {
  return (
    <div className="flex justify-between w-full">
      <div className="flex items-center gap-2">
        <Button variant="outline" className="bg-white">
          <Filter className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Filters</span>
        </Button>

        {columnDefinitions && visibleColumns && onColumnToggle && (
          <Button variant="outline" className="bg-white">
            <Settings2 className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Customise Columns</span>
          </Button>
        )}
      </div>

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