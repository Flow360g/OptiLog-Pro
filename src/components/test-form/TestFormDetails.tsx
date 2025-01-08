import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { TestDetailsSection } from "./TestDetailsSection";
import { TestTypeSection } from "./TestTypeSection";
import { DateSection } from "../form-sections/DateSection";
import { MetricsSection } from "../form-sections/MetricsSection";
import { TestCategory } from "../TestForm";

interface TestFormDetailsProps {
  testName: string;
  setTestName: (value: string) => void;
  hypothesis: string;
  setHypothesis: (value: string) => void;
  testKPI: string;
  setTestKPI: (value: string) => void;
  testCategory: TestCategory | undefined;
  setTestCategory: (value: TestCategory) => void;
  testType: string | undefined;
  setTestType: (value: string) => void;
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  setEffortLevel: (value: number) => void;
  setImpactLevel: (value: number) => void;
  isSubmitting: boolean;
}

export function TestFormDetails({
  testName,
  setTestName,
  hypothesis,
  setHypothesis,
  testKPI,
  setTestKPI,
  testCategory,
  setTestCategory,
  testType,
  setTestType,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  setEffortLevel,
  setImpactLevel,
  isSubmitting,
}: TestFormDetailsProps) {
  return (
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
  );
}