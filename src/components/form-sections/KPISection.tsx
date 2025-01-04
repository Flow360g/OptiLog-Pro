import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface KPISectionProps {
  platform: string;
  selectedKPI: string;
  onKPIChange: (value: string) => void;
  kpisByPlatform: Record<string, string[]>;
}

export function KPISection({ platform, selectedKPI, onKPIChange, kpisByPlatform }: KPISectionProps) {
  return (
    <div className="space-y-4">
      <Label htmlFor="kpi">KPI to Improve</Label>
      <Select value={selectedKPI} onValueChange={onKPIChange} disabled={!platform}>
        <SelectTrigger className="bg-white text-black">
          <SelectValue placeholder="Select KPI" />
        </SelectTrigger>
        <SelectContent>
          {platform &&
            kpisByPlatform[platform]?.map((kpi) => (
              <SelectItem key={kpi} value={kpi}>
                {kpi}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
}