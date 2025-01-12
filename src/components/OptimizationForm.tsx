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
import { DateSection } from "./form-sections/DateSection";
import { Loader2 } from "lucide-react";
import { categories, kpisByPlatform, optimizationSuggestions } from "@/data/optimizationData";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

export function OptimizationForm({ preselectedClient }: { preselectedClient?: string }) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isAutoSuggestLoading, setIsAutoSuggestLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [platform, setPlatform] = useState<string>("");
  const [selectedKPI, setSelectedKPI] = useState<string>("");
  const [recommendedAction, setRecommendedAction] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [campaignName, setCampaignName] = useState("");
  const [hypothesis, setHypothesis] = useState("");
  const [client, setClient] = useState(preselectedClient || "");
  const [effortLevel, setEffortLevel] = useState<number>(0);
  const [impactLevel, setImpactLevel] = useState<number>(0);

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

  const resetForm = () => {
    setSelectedCategories([]);
    setPlatform("");
    setSelectedKPI("");
    setRecommendedAction("");
    setSuggestions([]);
    setSelectedDate(undefined);
    setCampaignName("");
    setHypothesis("");
    setClient("");
    setEffortLevel(0);
    setImpactLevel(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to submit an optimization",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      if (!selectedDate) {
        toast({
          title: "Error",
          description: "Please select a date for the optimization",
          variant: "destructive",
        });
        return;
      }

      const formattedDate = format(selectedDate, 'yyyy-MM-dd');

      const { error } = await supabase.from('optimizations').insert({
        user_id: user.id,
        client,
        platform,
        campaign_name: campaignName,
        optimization_date: formattedDate,
        kpi: selectedKPI,
        hypothesis,
        recommended_action: recommendedAction,
        categories: selectedCategories,
        effort_level: effortLevel,
        impact_level: impactLevel,
      });

      if (error) {
        console.error('Error submitting optimization:', error);
        toast({
          title: "Error",
          description: "Failed to submit optimization. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setShowSuccessDialog(true);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateNew = () => {
    setShowSuccessDialog(false);
    resetForm();
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-8 bg-white rounded-lg border border-gray-200">
      <div className="space-y-6">
        <ClientSection 
          preselectedClient={preselectedClient} 
          onClientChange={(value) => setClient(value)}
        />
        
        <PlatformSection onPlatformChange={handlePlatformChange} />
        
        <div className="space-y-4">
          <Label htmlFor="campaign">Campaign Name</Label>
          <Input
            id="campaign"
            placeholder="Enter campaign name"
            className="bg-white text-black"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            required
          />
        </div>

        <DateSection selectedDate={selectedDate} onDateChange={setSelectedDate} />

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
            value={hypothesis}
            onChange={(e) => setHypothesis(e.target.value)}
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

        <MetricsSection
          onEffortChange={setEffortLevel}
          onImpactChange={setImpactLevel}
        />

        <Button disabled={isSubmitting} type="submit" className="w-full bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-opacity">
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
        onCreateNew={handleCreateNew}
        onBackToDashboard={handleBackToDashboard}
      />
    </form>
  );
}