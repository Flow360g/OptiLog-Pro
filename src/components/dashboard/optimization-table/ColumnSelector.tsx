import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";

interface Column {
  key: string;
  label: string;
}

interface ColumnSelectorProps {
  columns: Column[];
  visibleColumns: string[];
  onColumnToggle: (column: string) => void;
}

export function ColumnSelector({ columns, visibleColumns, onColumnToggle }: ColumnSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="bg-white">
          <Settings2 className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Customise Columns</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {columns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.key}
            checked={visibleColumns.includes(column.key)}
            onCheckedChange={() => onColumnToggle(column.key)}
          >
            {column.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}