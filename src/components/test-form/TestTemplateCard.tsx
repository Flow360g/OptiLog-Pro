import { Button } from "@/components/ui/button";
import { TemplateHelpTooltip } from "./template-card/TemplateHelpTooltip";

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
  const handleTooltipPosition = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const tooltipElement = button.parentElement?.querySelector('[role="tooltip"]');
    if (!tooltipElement) return;
    
    const buttonRect = button.getBoundingClientRect();
    const tooltipRect = tooltipElement.getBoundingClientRect();
    
    const rightOverflow = buttonRect.left + tooltipRect.width > window.innerWidth;
    const bottomOverflow = buttonRect.bottom + tooltipRect.height > window.innerHeight;

    tooltipElement.style.position = 'absolute';
    
    if (rightOverflow || bottomOverflow) {
      tooltipElement.style.top = 'auto';
      tooltipElement.style.bottom = '100%';
      tooltipElement.style.left = '50%';
      tooltipElement.style.transform = 'translateX(-50%)';
      tooltipElement.style.marginBottom = '8px';
    } else {
      tooltipElement.style.top = '100%';
      tooltipElement.style.bottom = 'auto';
      tooltipElement.style.left = '50%';
      tooltipElement.style.transform = 'translateX(-50%)';
      tooltipElement.style.marginTop = '8px';
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
        <TemplateHelpTooltip
          description={template.test_types?.description}
          hypothesis={template.hypothesis}
          onTooltipPosition={handleTooltipPosition}
        />
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