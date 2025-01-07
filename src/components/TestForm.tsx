import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ClientSection } from "./form-sections/ClientSection";
import { PlatformSection } from "./form-sections/PlatformSection";
import { DateSection } from "./form-sections/DateSection";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MetricsSection } from "./form-sections/MetricsSection";

export function TestForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [platform, setPlatform] = useState<"facebook" | "google" | "tiktok">();
  const [testName, setTestName] = useState("");
  const [hypothesis, setHypothesis] = useState("");
  const [testVariable, setTestVariable] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [client, setClient] = useState("");
  const [testType, setTestType] = useState("");
  const [effortLevel, setEffortLevel] = useState<number>(0);
  const [impactLevel, setImpactLevel] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to submit a test",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      if (!platform) {
        toast({
          title: "Error",
          description: "Please select a platform",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from('tests').insert({
        client,
        platform,
        name: testName,
        hypothesis,
        test_variable: testVariable,
        test_type: testType as "Creative Test" | "Audience Test" | "Bid Strategy Test",
        start_date: startDate,
        end_date: endDate,
        effort_level: effortLevel,
        impact_level: impactLevel,
        user_id: user.id,
      });

      if (error) {
        console.error('Error submitting test:', error);
        toast({
          title: "Error",
          description: "Failed to submit test. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Test has been scheduled successfully!",
      });
      
      navigate('/dashboard');
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

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-8 bg-white rounded-lg border border-gray-200">
      <div className="space-y-6">
        <ClientSection 
          onClientChange={(value) => setClient(value)}
        />
        
        <PlatformSection onPlatformChange={setPlatform} />
        
        <div className="space-y-4">
          <Label htmlFor="testName">Test Name</Label>
          <Input
            id="testName"
            placeholder="Enter test name"
            className="bg-white text-black"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-4">
          <Label htmlFor="testType">Test Type</Label>
          <Select value={testType} onValueChange={setTestType}>
            <SelectTrigger className="bg-white text-black">
              <SelectValue placeholder="Select test type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Creative Test">Creative Test</SelectItem>
              <SelectItem value="Audience Test">Audience Test</SelectItem>
              <SelectItem value="Bid Strategy Test">Bid Strategy Test</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label htmlFor="hypothesis">Hypothesis</Label>
          <Textarea
            id="hypothesis"
            placeholder="What do you expect to achieve with this test?"
            className="bg-white text-black"
            value={hypothesis}
            onChange={(e) => setHypothesis(e.target.value)}
            required
          />
        </div>

        <div className="space-y-4">
          <Label htmlFor="testVariable">Test Variable</Label>
          <Input
            id="testVariable"
            placeholder="What variable are you testing?"
            className="bg-white text-black"
            value={testVariable}
            onChange={(e) => setTestVariable(e.target.value)}
            required
          />
        </div>

        <div className="space-y-4">
          <Label>Start Date</Label>
          <DateSection selectedDate={startDate} onDateChange={setStartDate} />
        </div>

        <div className="space-y-4">
          <Label>End Date</Label>
          <DateSection selectedDate={endDate} onDateChange={setEndDate} />
        </div>

        <MetricsSection
          onEffortChange={setEffortLevel}
          onImpactChange={setImpactLevel}
        />

        <Button disabled={isSubmitting} type="submit" className="w-full gradient-bg">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Schedule Test"
          )}
        </Button>
      </div>
    </form>
  );
}