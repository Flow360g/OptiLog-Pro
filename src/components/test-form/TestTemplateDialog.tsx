import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { TestPlatform } from "../TestForm";

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
            category_id
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Choose a Test Template</DialogTitle>
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
                className="h-auto p-4 flex flex-col items-start gap-2 hover:bg-primary/5"
                onClick={() => onTemplateSelect(template)}
              >
                <span className="font-semibold">{template.name}</span>
                <span className="text-sm text-muted-foreground">
                  {template.hypothesis}
                </span>
                <span className="text-xs text-primary">KPI: {template.kpi}</span>
              </Button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}