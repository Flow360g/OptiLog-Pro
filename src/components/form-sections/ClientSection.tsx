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
import { useUserClients } from "@/hooks/useUserClients";

interface ClientSectionProps {
  preselectedClient?: string;
  onClientChange: (value: string) => void;
}

export function ClientSection({ preselectedClient, onClientChange }: ClientSectionProps) {
  const location = useLocation();
  const [selectedClient, setSelectedClient] = useState(preselectedClient);
  const { data: userClients = [] } = useUserClients();

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
      
      // Only set the preselected client if the user has access to it
      if (userClients.includes(mappedClient)) {
        setSelectedClient(mappedClient);
        onClientChange(mappedClient);
      }
    }
  }, [location.state, onClientChange, userClients]);

  const handleClientChange = (value: string) => {
    setSelectedClient(value);
    onClientChange(value);
  };

  // If no clients are available, show a message
  if (userClients.length === 0) {
    return (
      <div className="space-y-4">
        <Label htmlFor="client">Client</Label>
        <div className="text-gray-500">No clients assigned. Please update your settings.</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Label htmlFor="client">Client</Label>
      <Select value={selectedClient} onValueChange={handleClientChange}>
        <SelectTrigger className="bg-white text-black">
          <SelectValue placeholder="Select client" />
        </SelectTrigger>
        <SelectContent>
          {userClients.map(client => (
            <SelectItem key={client} value={client}>
              {client.toUpperCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}