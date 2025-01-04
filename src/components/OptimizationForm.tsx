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
import { CategorySelector } from "./form-sections/CategorySelector";
import { SuccessDialog } from "./form-sections/SuccessDialog";
import { Loader2 } from "lucide-react";
import { categories, kpisByPlatform, optimizationSuggestions } from "@/data/optimizationData";

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
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setShowSuccessDialog(true);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-8 space-y-8 form-container rounded-xl">
      <div className="space-y-6">
        <ClientSection />
        <PlatformSection onPlatformChange={handlePlatformChange} />
        
        <div className="space-y-4">
          <Label htmlFor="campaign">Campaign Name</Label>
          <Input
            id="campaign"
            placeholder="Enter campaign name"
            className="bg-white/50 border-blue-100 focus:border-blue-500 transition-colors"
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
            className="bg-white/50 border-blue-100 focus:border-blue-500 transition-colors"
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

        <CategorySelector
          categories={categories}
          selectedCategories={selectedCategories}
          onToggleCategory={toggleCategory}
        />

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

      <SuccessDialog 
        open={showSuccessDialog} 
        onOpenChange={setShowSuccessDialog}
      />
    </form>
  );
}