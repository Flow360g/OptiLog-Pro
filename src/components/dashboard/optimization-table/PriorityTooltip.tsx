import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PriorityItem {
  id: string;
  impact_level: number | null;
  effort_level: number | null;
}

interface PriorityTooltipProps {
  optimizations: PriorityItem[];
}

export function PriorityTooltip({ optimizations }: PriorityTooltipProps) {
  const calculatePriority = (impact: number, effort: number) => {
    return impact + (6 - effort);
  };

  // Sort optimizations by priority score
  const sortedOptimizations = [...optimizations].sort((a, b) => {
    if (!a.impact_level || !a.effort_level || !b.impact_level || !b.effort_level) return 0;
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
        <TooltipContent className="w-[400px] p-4">
          <div className="space-y-3">
            <div className="border rounded p-3 bg-gray-50">
              <div className="text-center mb-2">Effort vs. Impact Matrix</div>
              <div className="relative h-56 border-b border-l mb-8">
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
                  if (!opt.impact_level || !opt.effort_level) return null;
                  // Calculate position (normalize to 0-100%)
                  const x = ((opt.effort_level - 1) * 20) + 10; // Adjust for better spacing
                  const y = ((opt.impact_level - 1) * 20) + 10; // Adjust for better spacing
                  
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
            <p className="text-sm text-gray-600">
              We want to prioritise our work based on what produces the highest impact, with the lowest amount of effort.
            </p>
            <p className="text-sm text-gray-600">
              Priority Score = Impact + (6 - Effort). The higher the Impact and the lower
              the Effort, the higher the priority.
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}