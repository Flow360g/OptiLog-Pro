import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { OptimizationSuggestions } from "../OptimizationSuggestions";

interface RecommendedActionSectionProps {
  platform: string;
  selectedKPI: string;
  isAutoSuggestLoading: boolean;
  suggestions: string[];
  recommendedAction: string;
  onRecommendedActionChange: (value: string) => void;
  onAutoSuggest: () => void;
}

export function RecommendedActionSection({
  platform,
  selectedKPI,
  isAutoSuggestLoading,
  suggestions,
  recommendedAction,
  onRecommendedActionChange,
  onAutoSuggest,
}: RecommendedActionSectionProps) {
  return (
    <div className="space-y-4">
      <OptimizationSuggestions
        platform={platform}
        selectedKPI={selectedKPI}
        isLoading={isAutoSuggestLoading}
        suggestions={suggestions}
        selectedSuggestion={recommendedAction}
        onSuggestionSelect={onRecommendedActionChange}
        onAutoSuggest={onAutoSuggest}
      />

      <Textarea
        id="recommendedAction"
        value={recommendedAction}
        onChange={(e) => onRecommendedActionChange(e.target.value)}
        placeholder="Enter your recommended action or use auto-suggest above"
        className="bg-white text-black mb-4"
      />
    </div>
  );
}