interface TemplateTooltipContentProps {
  description?: string;
  hypothesis: string;
}

export function TemplateTooltipContent({ description, hypothesis }: TemplateTooltipContentProps) {
  return (
    <div className="space-y-4">
      <div>
        <p className="font-medium mb-2">Description:</p>
        <p className="text-sm text-muted-foreground whitespace-normal break-words leading-relaxed">
          {description || 'No description available'}
        </p>
      </div>
      <div>
        <p className="font-medium mb-2">Hypothesis:</p>
        <p className="text-sm text-muted-foreground whitespace-normal break-words leading-relaxed">
          {hypothesis}
        </p>
      </div>
    </div>
  );
}