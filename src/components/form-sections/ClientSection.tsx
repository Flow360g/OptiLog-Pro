import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ClientSection({ preselectedClient }: { preselectedClient?: string }) {
  return (
    <div className="space-y-4">
      <Label htmlFor="client">Client</Label>
      <Select defaultValue={preselectedClient}>
        <SelectTrigger className="bg-white text-black">
          <SelectValue placeholder="Select client" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="oes">OES</SelectItem>
          <SelectItem value="28bsw">28 By Sam Wood</SelectItem>
          <SelectItem value="gmhba">GMHBA</SelectItem>
          <SelectItem value="tgg">The Good Guys</SelectItem>
          <SelectItem value="nbn">NBN</SelectItem>
          <SelectItem value="abn">ABN</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}