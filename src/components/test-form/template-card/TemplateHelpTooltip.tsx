import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRef } from "react";
import { TemplateTooltipContent } from "./TemplateTooltipContent";

interface TemplateHelpTooltipProps {
  description?: string;
  hypothesis: string;
  onTooltipPosition: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export function TemplateHelpTooltip({ 
  description, 
  hypothesis, 
  onTooltipPosition 
}: TemplateHelpTooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className="p-0 h-auto hover:bg-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </Button>
        </TooltipTrigger>
        <TooltipContent 
          ref={tooltipRef}
          className="w-[400px] p-6 space-y-4 z-[9999]"
          onMouseEnter={onTooltipPosition}
        >
          <TemplateTooltipContent 
            description={description} 
            hypothesis={hypothesis} 
          />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}