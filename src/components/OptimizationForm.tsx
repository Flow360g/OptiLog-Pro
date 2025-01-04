import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { OptimizationSuggestions } from "./OptimizationSuggestions";

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

const effortLevels = ["Low", "Medium", "High"];
const impactLevels = ["Low", "Medium", "High"];

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
    
    // Simulate API call delay
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Optimization Submitted",
      description: "Your optimization has been logged successfully.",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold gradient-bg bg-clip-text text-transparent">
          OptiLog Pro
        </h1>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <Label htmlFor="client">Client</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="client1">Client 1</SelectItem>
              <SelectItem value="client2">Client 2</SelectItem>
              <SelectItem value="client3">Client 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label htmlFor="platform">Platform</Label>
          <Select onValueChange={handlePlatformChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="google">Google</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label htmlFor="kpi">KPI to Improve</Label>
          <Select
            value={selectedKPI}
            onValueChange={setSelectedKPI}
            disabled={!platform}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select KPI" />
            </SelectTrigger>
            <SelectContent>
              {platform &&
                kpisByPlatform[platform]?.map((kpi) => (
                  <SelectItem key={kpi} value={kpi}>
                    {kpi}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label htmlFor="campaign">Campaign Name</Label>
          <Input
            id="campaign"
            placeholder="Enter campaign name"
            className="bg-muted"
          />
        </div>

        <div className="space-y-4">
          <Label>Optimization Categories</Label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`category-pill ${
                  selectedCategories.includes(category) ? "selected" : ""
                }`}
                onClick={() => toggleCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <Label htmlFor="effort">Effort Required</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select effort level" />
              </SelectTrigger>
              <SelectContent>
                {effortLevels.map((level) => (
                  <SelectItem key={level} value={level.toLowerCase()}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label htmlFor="impact">Expected Impact</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select impact level" />
              </SelectTrigger>
              <SelectContent>
                {impactLevels.map((level) => (
                  <SelectItem key={level} value={level.toLowerCase()}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <Label htmlFor="hypothesis">Hypothesis (Optional)</Label>
          <Textarea
            id="hypothesis"
            placeholder="What do you think is causing the performance issue?"
            className="bg-muted"
          />
        </div>

        <OptimizationSuggestions
          platform={platform}
          selectedKPI={selectedKPI}
          isLoading={isAutoSuggestLoading}
          suggestions={suggestions}
          selectedSuggestion={recommendedAction}
          onSuggestionSelect={setRecommendedAction}
          onAutoSuggest={handleAutoSuggest}
        />

        <Button type="submit" className="w-full gradient-bg">
          Submit Optimization
        </Button>
      </div>
    </form>
  );
}