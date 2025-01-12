import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useUserClients } from "@/hooks/useUserClients";
import { Loader2 } from "lucide-react";

interface ClientSelectionScreenProps {
  onClientSelect: (client: string) => void;
}

export function ClientSelectionScreen({ onClientSelect }: ClientSelectionScreenProps) {
  const { data: userClients = [], isLoading } = useUserClients();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900">
        Select a Client
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {userClients.map((client) => (
          <Card
            key={client}
            className="p-6 hover:shadow-lg transition-all cursor-pointer hover:bg-gradient-to-r hover:from-primary hover:to-secondary"
            onClick={() => onClientSelect(client)}
          >
            <Button
              variant="ghost"
              className="w-full h-full text-lg font-medium text-gray-900 hover:text-white"
            >
              {client.toUpperCase()}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}