import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TestPlatform } from "../TestForm";

interface PlatformSectionProps {
  onPlatformChange: (value: TestPlatform) => void;
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
          <SelectItem value="google">Google Ads</SelectItem>
          <SelectItem value="tiktok">TikTok</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}