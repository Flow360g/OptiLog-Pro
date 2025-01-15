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
        <TooltipContent className="w-[500px] p-6">
          <div className="space-y-4">
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="text-center mb-4 font-medium">Effort vs. Impact Matrix</div>
              <div className="relative h-64 border-b border-l mb-10">
                {/* Y-axis label */}
                <div className="absolute -left-10 top-1/2 -translate-y-1/2 transform -rotate-90 text-sm font-medium">
                  Impact
                </div>
                {/* X-axis label */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm font-medium">
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
                      className="absolute w-2.5 h-2.5 bg-blue-500 rounded-full transform -translate-x-1 -translate-y-1"
                      style={{
                        left: `${x}%`,
                        bottom: `${y}%`,
                      }}
                    >
                      <span className="absolute -right-4 -top-4 text-xs font-medium">{index + 1}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-700 leading-relaxed">
                We prioritize work based on what produces the highest impact with the lowest amount of effort.
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                Priority Score = Impact + (6 - Effort). The higher the Impact and the lower
                the Effort, the higher the priority score will be.
              </p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}