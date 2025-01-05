import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Optimization } from "@/types/optimization";

interface PriorityTooltipProps {
  optimizations: Optimization[];
}

export function PriorityTooltip({ optimizations }: PriorityTooltipProps) {
  const calculatePriority = (impact: number, effort: number) => {
    return impact + (6 - effort);
  };

  // Sort optimizations by priority score
  const sortedOptimizations = [...optimizations].sort((a, b) => {
    const priorityA = calculatePriority(a.impact_level, a.effort_level);
    const priorityB = calculatePriority(b.impact_level, b.effort_level);
    return priorityB - priorityA;
  });

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <HelpCircle className="h-4 w-4 text-gray-500" />
        </TooltipTrigger>
        <TooltipContent className="w-80 p-4">
          <div className="space-y-3">
            <div className="border rounded p-3 bg-gray-50">
              <div className="text-center mb-2 font-semibold">Effort vs. Impact Matrix</div>
              <div className="relative h-48 border-b border-l">
                {/* Y-axis label */}
                <div className="absolute -left-8 top-1/2 -translate-y-1/2 transform -rotate-90 text-xs">
                  Impact
                </div>
                {/* X-axis label */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs">
                  Effort
                </div>
                {/* Plot points */}
                {sortedOptimizations.map((opt, index) => {
                  // Calculate position (normalize to 0-100%)
                  // Adjust the x calculation to start slightly out from Y axis
                  const x = ((opt.effort_level - 1) * 20) + 5; // 5% offset from Y axis
                  const y = (opt.impact_level - 1) * 20; // 5 levels = 20% each
                  
                  return (
                    <div
                      key={opt.id}
                      className="absolute w-2 h-2 bg-blue-500 rounded-full transform -translate-x-1 -translate-y-1"
                      style={{
                        left: `${x}%`,
                        bottom: `${y}%`,
                      }}
                    >
                      <span className="absolute -right-4 -top-4 text-xs">{index + 1}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <p className="italic text-sm">
              We want to prioritise our work based on what produces the highest impact, with the lowest amount of effort.
            </p>
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