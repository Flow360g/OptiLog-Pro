import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { TestPlatform, TestCategory } from "../TestForm";

export function useTestForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [platform, setPlatform] = useState<TestPlatform>();
  const [testName, setTestName] = useState("");
  const [hypothesis, setHypothesis] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [client, setClient] = useState("");
  const [testCategory, setTestCategory] = useState<TestCategory>();
  const [testType, setTestType] = useState<string>();
  const [testKPI, setTestKPI] = useState<string>("");
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

      if (!platform || !testCategory || !testType) {
        toast({
          title: "Error",
          description: "Please select a platform, test category, and test type",
          variant: "destructive",
        });
        return;
      }

      const { data: testTypeData, error: testTypeError } = await supabase
        .from('test_types')
        .select('id')
        .eq('name', testType)
        .maybeSingle();

      if (testTypeError) {
        console.error('Error getting test type:', testTypeError);
        toast({
          title: "Error",
          description: "Failed to get test type. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (!testTypeData) {
        toast({
          title: "Error",
          description: "Selected test type not found. Please select a different test type.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from('tests').insert({
        client,
        platform,
        name: testName,
        hypothesis,
        test_type_id: testTypeData.id,
        start_date: startDate?.toISOString().split('T')[0],
        end_date: endDate?.toISOString().split('T')[0],
        effort_level: effortLevel,
        impact_level: impactLevel,
        user_id: user.id,
        kpi: testKPI,
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
      
      navigate('/testing-schedule');
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

  return {
    isSubmitting,
    platform,
    setPlatform,
    testName,
    setTestName,
    hypothesis,
    setHypothesis,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    client,
    setClient,
    testCategory,
    setTestCategory,
    testType,
    setTestType,
    testKPI,
    setTestKPI,
    effortLevel,
    setEffortLevel,
    impactLevel,
    setImpactLevel,
    handleSubmit,
  };
}