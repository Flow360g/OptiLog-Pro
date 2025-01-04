import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ClientSection } from "./form-sections/ClientSection";
import { PlatformSection } from "./form-sections/PlatformSection";
import { KPISection } from "./form-sections/KPISection";
import { MetricsSection } from "./form-sections/MetricsSection";
import { RecommendedActionSection } from "./form-sections/RecommendedActionSection";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const categories = [
  "Creative",
  "Targeting",
  "Bidding Strategy",
  "Budget Allocation",
  "Audience",
  "Conversion Setup",
  "Ad Copy",
  "Landing Page",
];

const kpisByPlatform = {
  facebook: ["CPC", "CPM", "CTR", "ROAS", "CPA"],
  google: ["CPC", "Impression Share", "Quality Score", "CTR", "Conversion Rate"],
  linkedin: ["CPC", "CPM", "CTR", "Lead Gen Rate", "Engagement Rate"],
};

const optimizationSuggestions = {
  facebook: {
    CPM: [
      "Broaden audience targeting to increase reach and lower CPM",
      "Optimize ad placements to focus on lower-cost inventory",
      "Adjust campaign schedule to off-peak hours",
    ],
    CPC: [
      "Improve ad relevance score through better creative-audience matching",
      "Test different ad formats to find most cost-effective option",
      "Optimize bidding strategy based on click-through rate patterns",
    ],
    ROAS: [
      "Implement value-based lookalike audiences",
      "Adjust campaign budget based on top-performing demographics",
      "Optimize creative elements based on conversion data",
    ],
  },
  google: {
    "Quality Score": [
      "Improve ad relevance by aligning keywords with ad copy",
      "Optimize landing page experience for selected keywords",
      "Structure ad groups with tighter keyword themes",
    ],
    "Impression Share": [
      "Review and adjust bid strategy for key terms",
      "Expand budget for high-performing campaigns",
      "Optimize ad scheduling for peak performance periods",
    ],
  },
  linkedin: {
    CPM: [
      "Refine audience targeting to most relevant job titles",
      "Test different ad formats for better engagement",
      "Optimize campaign scheduling for B2B hours",
    ],
    "Lead Gen Rate": [
      "Improve form fields and length for better completion rate",
      "Test different lead magnet offers",
      "Optimize targeting based on historical lead quality data",
    ],
  },
};

export function OptimizationForm() {
  const { toast } = useToast();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isAutoSuggestLoading, setIsAutoSuggestLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [platform, setPlatform] = useState<string>("");
  const [selectedKPI, setSelectedKPI] = useState<string>("");
  const [recommendedAction, setRecommendedAction] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handlePlatformChange = (value: string) => {
    setPlatform(value);
    setSelectedKPI("");
    setSuggestions([]);
    setRecommendedAction("");
  };

  const handleAutoSuggest = async () => {
    setIsAutoSuggestLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    if (platform && selectedKPI && optimizationSuggestions[platform]?.[selectedKPI]) {
      setSuggestions(optimizationSuggestions[platform][selectedKPI]);
    }
    
    setIsAutoSuggestLoading(false);
    toast({
      title: "Suggestions Generated",
      description: "We've analyzed your data and generated recommendations.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setShowSuccessDialog(true);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-8 bg-[#100c2a] rounded-lg border border-white">
        <div className="space-y-6">
          <ClientSection />
          <PlatformSection onPlatformChange={handlePlatformChange} />
          
          <div className="space-y-4">
            <Label htmlFor="campaign">Campaign Name</Label>
            <Input
              id="campaign"
              placeholder="Enter campaign name"
              className="bg-white text-black"
            />
          </div>

          <KPISection
            platform={platform}
            selectedKPI={selectedKPI}
            onKPIChange={setSelectedKPI}
            kpisByPlatform={kpisByPlatform}
          />

          <div className="space-y-4">
            <Label htmlFor="hypothesis">Hypothesis (Optional)</Label>
            <Textarea
              id="hypothesis"
              placeholder="What do you think is causing the performance issue?"
              className="bg-white text-black"
            />
          </div>

          <RecommendedActionSection
            platform={platform}
            selectedKPI={selectedKPI}
            isAutoSuggestLoading={isAutoSuggestLoading}
            suggestions={suggestions}
            recommendedAction={recommendedAction}
            onRecommendedActionChange={setRecommendedAction}
            onAutoSuggest={handleAutoSuggest}
          />

          <div className="space-y-4">
            <Label>Optimization Categories</Label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`category-pill border-white ${
                    selectedCategories.includes(category) ? "selected" : ""
                  }`}
                  onClick={() => toggleCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <MetricsSection />

          <Button disabled={isSubmitting} type="submit" className="w-full gradient-bg">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Optimization"
            )}
          </Button>
        </div>
      </form>

      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-center">
              Nice work! 🎉 👏
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-gray-700 text-lg">
              Your optimisation has been successfully logged and is ready for approval. Your team has been notified.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
