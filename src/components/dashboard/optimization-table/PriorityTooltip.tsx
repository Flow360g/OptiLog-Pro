import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function PriorityTooltip() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <HelpCircle className="h-4 w-4 text-gray-500" />
        </TooltipTrigger>
        <TooltipContent className="w-64 p-4">
          <div className="space-y-3">
            <div className="border rounded p-3 bg-gray-50">
              <div className="text-center mb-2 font-semibold">Effort vs. Impact Matrix</div>
              <div className="relative h-32 border-b border-l">
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 transform -rotate-90 text-xs">
                  Impact
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs">
                  Effort
                </div>
              </div>
            </div>
            <p className="text-sm">
              Priority Score = Impact + (6 - Effort). The higher the Impact and the lower
              the Effort, the higher the priority.
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}