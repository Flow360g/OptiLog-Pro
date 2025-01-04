import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ClientSection() {
  return (
    <div className="space-y-4">
      <Label htmlFor="client">Client</Label>
      <Select>
        <SelectTrigger className="bg-white text-black">
          <SelectValue placeholder="Select client" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="client1">Client 1</SelectItem>
          <SelectItem value="client2">Client 2</SelectItem>
          <SelectItem value="client3">Client 3</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}