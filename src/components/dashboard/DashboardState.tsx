import { useState } from "react";
import { OptimizationsByClient } from "@/types/optimization";

export function useDashboardState() {
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [optimizationsByClient, setOptimizationsByClient] = useState<OptimizationsByClient>({});
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "priority",
    "campaign",
    "platform",
    "kpi",
    "action",
    "categories",
    "added_by",
    "status"
  ]);

  const handleColumnToggle = (column: string) => {
    setVisibleColumns((prev) =>
      prev.includes(column)
        ? prev.filter((col) => col !== column)
        : [...prev, column]
    );
  };

  return {
    selectedClient,
    setSelectedClient,
    selectedPlatform,
    setSelectedPlatform,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    optimizationsByClient,
    setOptimizationsByClient,
    visibleColumns,
    handleColumnToggle
  };
}