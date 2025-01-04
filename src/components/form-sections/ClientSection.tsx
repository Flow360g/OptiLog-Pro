import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export function ClientSection({ preselectedClient }: { preselectedClient?: string }) {
  const location = useLocation();
  const [selectedClient, setSelectedClient] = useState(preselectedClient);

  useEffect(() => {
    if (location.state?.preselectedClient) {
      const clientMap: { [key: string]: string } = {
        'oes': 'oes',
        '28bsw': '28bsw',
        'gmhba': 'gmhba',
        'tgg': 'tgg',
        'nbn': 'nbn',
        'abn': 'abn'
      };
      
      const normalizedClient = location.state.preselectedClient.toLowerCase();
      setSelectedClient(clientMap[normalizedClient] || normalizedClient);
    }
  }, [location.state]);

  return (
    <div className="space-y-4">
      <Label htmlFor="client">Client</Label>
      <Select value={selectedClient} onValueChange={setSelectedClient}>
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