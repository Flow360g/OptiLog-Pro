import { ClientSection } from "./form-sections/ClientSection";
import { PlatformSection } from "./form-sections/PlatformSection";
import { TestSourceSection } from "./test-form/TestSourceSection";
import { TestFormDetails } from "./test-form/TestFormDetails";
import { useTestForm } from "./test-form/useTestForm";
import { useState } from "react";
import { TestTemplateDialog } from "./test-form/TestTemplateDialog";
import { useToast } from "@/hooks/use-toast";

export type TestPlatform = "facebook" | "google" | "tiktok";
export type TestCategory = "Creative Test" | "Audience Test" | "Bid Strategy Test";

export function TestForm() {
  const { toast } = useToast();
  const [testSource, setTestSource] = useState<'new' | 'library'>();
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const {
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
  } = useTestForm();

  const handleSourceSelect = (source: 'new' | 'library') => {
    if (!platform) {
      toast({
        title: "Please select a platform first",
        description: "A platform is required to view relevant test templates",
        variant: "destructive",
      });
      return;
    }
    
    setTestSource(source);
    if (source === 'library') {
      setShowTemplateDialog(true);
    }
  };

  const handleTemplateSelect = (template: any) => {
    setTestName(template.name);
    setHypothesis(template.hypothesis);
    setTestKPI(template.kpi);
    setTestType(template.test_types.name);
    setShowTemplateDialog(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-8 bg-white rounded-lg border border-gray-200">
      <div className="space-y-6">
        <ClientSection 
          onClientChange={(value) => setClient(value)}
        />
        
        <PlatformSection onPlatformChange={setPlatform} />

        <TestSourceSection onSourceSelect={handleSourceSelect} />

        {testSource === 'new' && platform && client && (
          <TestFormDetails
            testName={testName}
            setTestName={setTestName}
            hypothesis={hypothesis}
            setHypothesis={setHypothesis}
            testKPI={testKPI}
            setTestKPI={setTestKPI}
            testCategory={testCategory}
            setTestCategory={setTestCategory}
            testType={testType}
            setTestType={setTestType}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            setEffortLevel={setEffortLevel}
            setImpactLevel={setImpactLevel}
            isSubmitting={isSubmitting}
          />
        )}

        <TestTemplateDialog
          open={showTemplateDialog}
          onOpenChange={setShowTemplateDialog}
          platform={platform}
          onTemplateSelect={handleTemplateSelect}
        />
      </div>
    </form>
  );
}