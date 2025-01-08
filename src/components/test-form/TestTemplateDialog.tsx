import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TestPlatform } from "../TestForm";
import { useRef, useCallback } from "react";

interface TestTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  platform?: TestPlatform;
  onTemplateSelect: (template: any) => void;
}

export function TestTemplateDialog({
  open,
  onOpenChange,
  platform,
  onTemplateSelect,
}: TestTemplateDialogProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleTooltipPosition = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    if (!tooltipRef.current) return;
    
    const button = event.currentTarget;
    const buttonRect = button.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    
    // Check if tooltip would overflow right side of viewport
    const rightOverflow = buttonRect.left + tooltipRect.width > window.innerWidth;
    // Check if tooltip would overflow bottom of viewport
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
  }, []);

  const { data: templates, isLoading } = useQuery({
    queryKey: ['testTemplates', platform],
    queryFn: async () => {
      if (!platform) return [];
      
      const { data, error } = await supabase
        .from('test_templates')
        .select(`
          *,
          test_types (
            name,
            description,
            category:test_categories(name)
          )
        `)
        .eq('platform', platform);

      if (error) throw error;
      return data;
    },
    enabled: !!platform,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-visible">
        <DialogHeader>
          <DialogTitle>Choose a Test Template</DialogTitle>
          <DialogDescription>
            Select a template to pre-fill your test details
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {templates?.map((template) => (
              <Button
                key={template.id}
                variant="outline"
                className="h-auto p-6 flex flex-col items-start gap-2 hover:bg-primary/5 group relative"
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
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}