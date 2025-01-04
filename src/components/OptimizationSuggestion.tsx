import React from "react";
import { HelpCircle } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface OptimizationSuggestionProps {
  suggestion: string;
  explanation: string;
  isSelected: boolean;
  onClick: () => void;
}

export function OptimizationSuggestion({
  suggestion,
  explanation,
  isSelected,
  onClick,
}: OptimizationSuggestionProps) {
  return (
    <div
      className={`p-4 mb-2 rounded-lg border-2 transition-all cursor-pointer
        ${
          isSelected
            ? "border-primary bg-muted"
            : "border-muted hover:border-primary"
        }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start gap-2">
        <p className="text-sm">{suggestion}</p>
        <HoverCard>
          <HoverCardTrigger asChild>
            <button className="p-1 hover:text-primary">
              <HelpCircle className="h-4 w-4" />
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <p className="text-sm">{explanation}</p>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  );
}