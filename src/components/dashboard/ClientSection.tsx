import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { OptimizationTable } from "./OptimizationTable";
import { Optimization } from "@/types/optimization";

interface ClientSectionProps {
  client: string;
  optimizations: Optimization[];
  onStatusChange: (optimizationId: string, newStatus: string) => void;
  visibleColumns: string[];
}

export function ClientSection({ 
  client, 
  optimizations, 
  onStatusChange,
  visibleColumns 
}: ClientSectionProps) {
  const navigate = useNavigate();

  const getFormattedClientName = (clientName: string) => {
    switch (clientName.toLowerCase()) {
      case '28bsw':
        return '28 By Sam Wood';
      default:
        return clientName.toUpperCase();
    }
  };

  const handleCreateOptimization = (client: string) => {
    navigate('/', { 
      state: { 
        preselectedClient: client.toLowerCase() 
      } 
    });
  };

  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-900">{getFormattedClientName(client)}</h2>
        <Button 
          onClick={() => handleCreateOptimization(client)}
          className="gradient-bg"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Optimization
        </Button>
      </div>
      <OptimizationTable 
        optimizations={optimizations}
        onStatusChange={onStatusChange}
        visibleColumns={visibleColumns}
      />
    </section>
  );
}