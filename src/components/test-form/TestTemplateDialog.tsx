import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TestPlatform } from "../TestForm";
import { TestTemplateList } from "./TestTemplateList";

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
        
        <TestTemplateList
          templates={templates}
          isLoading={isLoading}
          onTemplateSelect={onTemplateSelect}
        />
      </DialogContent>
    </Dialog>
  );
}