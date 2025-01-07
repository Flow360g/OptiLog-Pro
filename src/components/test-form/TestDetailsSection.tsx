import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TestDetailsSectionProps {
  testName: string;
  setTestName: (value: string) => void;
  hypothesis: string;
  setHypothesis: (value: string) => void;
  testKPI: string;
  setTestKPI: (value: string) => void;
}

export function TestDetailsSection({
  testName,
  setTestName,
  hypothesis,
  setHypothesis,
  testKPI,
  setTestKPI,
}: TestDetailsSectionProps) {
  return (
    <>
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
        <Label htmlFor="testKPI">Test KPI</Label>
        <Select value={testKPI} onValueChange={setTestKPI}>
          <SelectTrigger className="bg-white text-black">
            <SelectValue placeholder="Select test KPI" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CPA">CPA</SelectItem>
            <SelectItem value="ROAS">ROAS</SelectItem>
            <SelectItem value="CTR">CTR</SelectItem>
            <SelectItem value="CPM">CPM</SelectItem>
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
    </>
  );
}