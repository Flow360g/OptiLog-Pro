import React from "react";
import { OptimizationSuggestion } from "./OptimizationSuggestion";
import { Button } from "./ui/button";
import { Wand2 } from "lucide-react";

interface OptimizationSuggestionsProps {
  platform: string;
  selectedKPI: string;
  isLoading: boolean;
  suggestions: string[];
  selectedSuggestion: string;
  onSuggestionSelect: (suggestion: string) => void;
  onAutoSuggest: () => void;
}

const explanations = {
  facebook: {
    CPM: {
      "Broaden audience targeting to increase reach and lower CPM":
        "Wider audiences typically result in lower CPM as there's less competition for the same audience segment.",
      "Optimize ad placements to focus on lower-cost inventory":
        "Different placements have varying costs. Testing and focusing on cost-effective placements can reduce overall CPM.",
      "Adjust campaign schedule to off-peak hours":
        "Running ads during off-peak hours often results in lower costs due to reduced competition.",
    },
    CPC: {
      "Improve ad relevance score through better creative-audience matching":
        "Higher relevance scores lead to better ad delivery and potentially lower costs per click.",
      "Test different ad formats to find most cost-effective option":
        "Different ad formats can significantly impact click-through rates and costs.",
      "Optimize bidding strategy based on click-through rate patterns":
        "Analyzing and adjusting bids based on performance patterns can improve CPC efficiency.",
    },
    ROAS: {
      "Implement value-based lookalike audiences":
        "Creating audiences based on high-value customers can improve return on ad spend.",
      "Adjust campaign budget based on top-performing demographics":
        "Allocating budget to best-performing segments maximizes ROAS.",
      "Optimize creative elements based on conversion data":
        "Using conversion insights to refine creative elements can improve overall campaign performance.",
    },
  },
  google: {
    "Quality Score": {
      "Improve ad relevance by aligning keywords with ad copy":
        "Better alignment between keywords and ad copy leads to higher Quality Scores and lower costs.",
      "Optimize landing page experience for selected keywords":
        "Landing page relevance and user experience directly impact Quality Score.",
      "Structure ad groups with tighter keyword themes":
        "More focused ad groups allow for better message match and improved Quality Scores.",
    },
    "Impression Share": {
      "Review and adjust bid strategy for key terms":
        "Proper bid management ensures ads show for important search queries.",
      "Expand budget for high-performing campaigns":
        "Increased budget can capture more of the available impression share.",
      "Optimize ad scheduling for peak performance periods":
        "Focusing budget on high-performance times maximizes impression share when it matters most.",
    },
  },
  linkedin: {
    CPM: {
      "Refine audience targeting to most relevant job titles":
        "More specific targeting can improve relevance and reduce wasted spend.",
      "Test different ad formats for better engagement":
        "Different formats can affect costs and performance significantly.",
      "Optimize campaign scheduling for B2B hours":
        "Focusing on business hours can improve efficiency for B2B campaigns.",
    },
    "Lead Gen Rate": {
      "Improve form fields and length for better completion rate":
        "Optimizing form structure can significantly impact lead generation rates.",
      "Test different lead magnet offers":
        "Different offers can attract varying levels of interest and conversion rates.",
      "Optimize targeting based on historical lead quality data":
        "Using past performance data to refine targeting can improve lead quality.",
    },
  },
};

export function OptimizationSuggestions({
  platform,
  selectedKPI,
  isLoading,
  suggestions,
  selectedSuggestion,
  onSuggestionSelect,
  onAutoSuggest,
}: OptimizationSuggestionsProps) {
  const isButtonEnabled = platform && selectedKPI && !isLoading;
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label htmlFor="action" className="text-sm font-medium">
          Recommended Action
        </label>
        <Button
          type="button"
          variant="gradient"
          size="sm"
          onClick={onAutoSuggest}
          disabled={!isButtonEnabled}
          className="bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Wand2 className="w-4 h-4 mr-2" />
          Auto-suggest
        </Button>
      </div>

      {suggestions.length > 0 && (
        <div className="space-y-2">
          {suggestions.map((suggestion) => (
            <OptimizationSuggestion
              key={suggestion}
              suggestion={suggestion}
              explanation={
                explanations[platform]?.[selectedKPI]?.[suggestion] ||
                "No explanation available."
              }
              isSelected={selectedSuggestion === suggestion}
              onClick={() => onSuggestionSelect(suggestion)}
            />
          ))}
        </div>
      )}
    </div>
  );
}