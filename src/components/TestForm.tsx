import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ClientSection } from "./form-sections/ClientSection";
import { PlatformSection } from "./form-sections/PlatformSection";
import { DateSection } from "./form-sections/DateSection";
import { MetricsSection } from "./form-sections/MetricsSection";
import { TestTypeSection } from "./test-form/TestTypeSection";
import { TestDetailsSection } from "./test-form/TestDetailsSection";
import { TestSourceSection } from "./test-form/TestSourceSection";
import { useTestForm } from "./test-form/useTestForm";
import { useState } from "react";

export type TestPlatform = "facebook" | "google" | "tiktok";
export type TestCategory = "Creative Test" | "Audience Test" | "Bid Strategy Test";

export function TestForm() {
  const [testSource, setTestSource] = useState<'new' | 'library'>();
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
    setTestSource(source);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-8 bg-white rounded-lg border border-gray-200">
      <div className="space-y-6">
        <TestSourceSection onSourceSelect={handleSourceSelect} />
        
        {testSource && (
          <>
            <ClientSection 
              onClientChange={(value) => setClient(value)}
            />
            
            <PlatformSection onPlatformChange={setPlatform} />

            {platform && client && (
              <>
                <TestDetailsSection
                  testName={testName}
                  setTestName={setTestName}
                  hypothesis={hypothesis}
                  setHypothesis={setHypothesis}
                  testKPI={testKPI}
                  setTestKPI={setTestKPI}
                />

                <TestTypeSection
                  testCategory={testCategory}
                  setTestCategory={setTestCategory}
                  testType={testType}
                  setTestType={setTestType}
                />

                <div className="space-y-4">
                  <DateSection selectedDate={startDate} onDateChange={setStartDate} />
                </div>

                <div className="space-y-4">
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
              </>
            )}
          </>
        )}
      </div>
    </form>
  );
}