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

interface ClientSectionProps {
  preselectedClient?: string;
  onClientChange: (value: string) => void;
}

export function ClientSection({ preselectedClient, onClientChange }: ClientSectionProps) {
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
      const mappedClient = clientMap[normalizedClient] || normalizedClient;
      setSelectedClient(mappedClient);
      onClientChange(mappedClient);
    }
  }, [location.state, onClientChange]);

  const handleClientChange = (value: string) => {
    setSelectedClient(value);
    onClientChange(value);
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="client">Client</Label>
      <Select value={selectedClient} onValueChange={handleClientChange}>
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