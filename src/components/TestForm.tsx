import { ClientSection } from "./form-sections/ClientSection";
import { PlatformSection } from "./form-sections/PlatformSection";
import { TestSourceSection } from "./test-form/TestSourceSection";
import { TestFormDetails } from "./test-form/TestFormDetails";
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
        <ClientSection 
          onClientChange={(value) => setClient(value)}
        />
        
        <PlatformSection onPlatformChange={setPlatform} />

        <TestSourceSection onSourceSelect={handleSourceSelect} />

        {testSource && platform && client && (
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
      </div>
    </form>
  );
}