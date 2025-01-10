import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ExecutiveSummaryProps {
  executiveSummary: string;
  onSummaryChange: (value: string) => void;
  onSummaryBlur: () => void;
  onGenerateSummary: () => void;
  hasResults: boolean;
}

export function ExecutiveSummarySection({
  executiveSummary,
  onSummaryChange,
  onSummaryBlur,
  onGenerateSummary,
  hasResults,
}: ExecutiveSummaryProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label htmlFor="executive-summary">Executive Summary</Label>
        {hasResults && (
          <Button onClick={onGenerateSummary} variant="outline" size="sm">
            Generate Summary
          </Button>
        )}
      </div>
      <Textarea
        id="executive-summary"
        value={executiveSummary}
        onChange={(e) => onSummaryChange(e.target.value)}
        onBlur={onSummaryBlur}
        placeholder="Enter or generate an executive summary for this test..."
        className="min-h-[100px]"
      />
    </div>
  );
}