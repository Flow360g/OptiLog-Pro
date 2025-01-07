import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TestCategory } from "../TestForm";

interface TestTypeSectionProps {
  testCategory: TestCategory | undefined;
  setTestCategory: (value: TestCategory) => void;
  testType: string | undefined;
  setTestType: (value: string) => void;
}

export function TestTypeSection({
  testCategory,
  setTestCategory,
  testType,
  setTestType,
}: TestTypeSectionProps) {
  return (
    <>
      <div className="space-y-4">
        <Label htmlFor="testCategory">Test Category</Label>
        <Select value={testCategory} onValueChange={(value: TestCategory) => setTestCategory(value)}>
          <SelectTrigger className="bg-white text-black">
            <SelectValue placeholder="Select test category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Creative Test">Creative Test</SelectItem>
            <SelectItem value="Audience Test">Audience Test</SelectItem>
            <SelectItem value="Bid Strategy Test">Bid Strategy Test</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Label htmlFor="testType">Test Type</Label>
        <Select value={testType} onValueChange={setTestType}>
          <SelectTrigger className="bg-white text-black">
            <SelectValue placeholder="Select test type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Image Test">Image Test</SelectItem>
            <SelectItem value="Video Test">Video Test</SelectItem>
            <SelectItem value="Copy Test">Copy Test</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}