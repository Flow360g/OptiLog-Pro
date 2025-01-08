import { Loader2 } from "lucide-react";
import { TestTemplateCard } from "./TestTemplateCard";

interface TestTemplateListProps {
  templates: any[] | null;
  isLoading: boolean;
  onTemplateSelect: (template: any) => void;
}

export function TestTemplateList({ templates, isLoading, onTemplateSelect }: TestTemplateListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {templates?.map((template) => (
        <TestTemplateCard
          key={template.id}
          template={template}
          onTemplateSelect={onTemplateSelect}
        />
      ))}
    </div>
  );
}