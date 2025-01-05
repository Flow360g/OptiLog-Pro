import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ClientSelectorProps {
  selectedClients: string[];
  onClientToggle: (client: string) => void;
}

export function ClientSelector({ selectedClients, onClientToggle }: ClientSelectorProps) {
  const availableClients = ["oes", "28bsw", "gmhba", "tgg", "nbn", "abn"];

  return (
    <div className="space-y-4">
      <Label>Select Clients</Label>
      <div className="grid grid-cols-2 gap-2">
        {availableClients.map((client) => (
          <Button
            key={client}
            variant={selectedClients.includes(client) ? "default" : "outline"}
            onClick={() => onClientToggle(client)}
            className="w-full"
          >
            {client.toUpperCase()}
          </Button>
        ))}
      </div>
    </div>
  );
}