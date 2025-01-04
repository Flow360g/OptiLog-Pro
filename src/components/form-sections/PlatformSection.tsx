import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PlatformSectionProps {
  onPlatformChange: (value: string) => void;
}

export function PlatformSection({ onPlatformChange }: PlatformSectionProps) {
  return (
    <div className="space-y-4">
      <Label htmlFor="platform">Platform</Label>
      <Select onValueChange={onPlatformChange}>
        <SelectTrigger className="bg-white text-black">
          <SelectValue placeholder="Select platform" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="facebook">Facebook</SelectItem>
          <SelectItem value="google">Google</SelectItem>
          <SelectItem value="linkedin">LinkedIn</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}