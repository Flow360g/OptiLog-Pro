import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const levels = ["1", "2", "3", "4", "5"];

export function MetricsSection() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-4">
        <Label htmlFor="effort">Effort Required</Label>
        <Select>
          <SelectTrigger className="bg-white text-black">
            <SelectValue placeholder="Select effort level" />
          </SelectTrigger>
          <SelectContent>
            {levels.map((level) => (
              <SelectItem key={level} value={level}>
                Level {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Label htmlFor="impact">Expected Impact</Label>
        <Select>
          <SelectTrigger className="bg-white text-black">
            <SelectValue placeholder="Select impact level" />
          </SelectTrigger>
          <SelectContent>
            {levels.map((level) => (
              <SelectItem key={level} value={level}>
                Level {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}