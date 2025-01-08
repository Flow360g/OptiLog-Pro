import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRef } from "react";

interface TestTemplateCardProps {
  template: {
    id: string;
    name: string;
    kpi: string;
    hypothesis: string;
    test_types: {
      description?: string;
      category?: {
        name?: string;
      };
    };
  };
  onTemplateSelect: (template: any) => void;
}

export function TestTemplateCard({ template, onTemplateSelect }: TestTemplateCardProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleTooltipPosition = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!tooltipRef.current) return;
    
    const button = event.currentTarget;
    const buttonRect = button.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    
    const rightOverflow = buttonRect.left + tooltipRect.width > window.innerWidth;
    const bottomOverflow = buttonRect.bottom + tooltipRect.height > window.innerHeight;

    tooltipRef.current.style.position = 'absolute';
    
    if (rightOverflow || bottomOverflow) {
      tooltipRef.current.style.top = 'auto';
      tooltipRef.current.style.bottom = '100%';
      tooltipRef.current.style.left = '50%';
      tooltipRef.current.style.transform = 'translateX(-50%)';
      tooltipRef.current.style.marginBottom = '8px';
    } else {
      tooltipRef.current.style.top = '100%';
      tooltipRef.current.style.bottom = 'auto';
      tooltipRef.current.style.left = '50%';
      tooltipRef.current.style.transform = 'translateX(-50%)';
      tooltipRef.current.style.marginTop = '8px';
    }
  };

  return (
    <Button
      variant="outline"
      className="h-auto p-6 flex flex-col items-start gap-2 hover:bg-primary/5 group relative hover:text-foreground"
      onClick={() => onTemplateSelect(template)}
      onMouseEnter={handleTooltipPosition}
    >
      <div className="flex items-start justify-between w-full">
        <span className="font-semibold text-lg">{template.name}</span>
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
            >
              <div className="space-y-4">
                <div>
                  <p className="font-medium mb-2">Description:</p>
                  <p className="text-sm text-muted-foreground whitespace-normal break-words leading-relaxed">
                    {template.test_types?.description || 'No description available'}
                  </p>
                </div>
                <div>
                  <p className="font-medium mb-2">Hypothesis:</p>
                  <p className="text-sm text-muted-foreground whitespace-normal break-words leading-relaxed">
                    {template.hypothesis}
                  </p>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <span className="text-sm text-primary">
        KPI: {template.kpi}
      </span>
      <span className="text-xs text-muted-foreground">
        {template.test_types?.category?.name}
      </span>
    </Button>
  );
}