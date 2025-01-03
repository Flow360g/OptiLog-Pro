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
import { Wand2 } from "lucide-react";

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

export function OptimizationForm() {
  const { toast } = useToast();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isAutoSuggestLoading, setIsAutoSuggestLoading] = useState(false);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleAutoSuggest = async () => {
    setIsAutoSuggestLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsAutoSuggestLoading(false);
    toast({
      title: "Suggestion Generated",
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
          <Select>
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

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="action">Recommended Action</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAutoSuggest}
              disabled={isAutoSuggestLoading}
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Auto-suggest
            </Button>
          </div>
          <Textarea
            id="action"
            placeholder="What specific changes do you recommend?"
            className="bg-muted"
          />
        </div>

        <Button type="submit" className="w-full gradient-bg">
          Submit Optimization
        </Button>
      </div>
    </form>
  );
}