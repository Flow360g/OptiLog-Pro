import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatisticalGroupData } from "../../types";

interface StatisticalDataFormProps {
  label: string;
  data: StatisticalGroupData;
  onChange: (field: "conversions" | "impressions", value: string) => void;
}

export function StatisticalDataForm({ label, data, onChange }: StatisticalDataFormProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">{label}</h3>
      <div className="space-y-2">
        <Label htmlFor={`${label}-conversions`}>Conversions</Label>
        <Input
          id={`${label}-conversions`}
          type="number"
          min="0"
          value={data.conversions}
          onChange={(e) => onChange("conversions", e.target.value)}
          placeholder="0"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${label}-impressions`}>Impressions</Label>
        <Input
          id={`${label}-impressions`}
          type="number"
          min="1"
          value={data.impressions}
          onChange={(e) => onChange("impressions", e.target.value)}
        />
      </div>
    </div>
  );
}