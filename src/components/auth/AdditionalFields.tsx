import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const AdditionalFields = () => {
  const navigate = useNavigate();
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [position, setPosition] = useState<string>("");

  const handleClientToggle = (client: string) => {
    setSelectedClients(prev => 
      prev.includes(client) 
        ? prev.filter(c => c !== client)
        : [...prev, client]
    );
  };

  const handleSubmitAdditionalInfo = async () => {
    try {
      if (!position || selectedClients.length === 0) {
        toast.error("Please select both position and at least one client");
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("No user found");
        return;
      }

      // Update profile with position
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ position })
        .eq('id', user.id);

      if (profileError) {
        console.error("Profile update error:", profileError);
        toast.error("Failed to update position");
        return;
      }

      // Insert selected clients
      const { error: clientsError } = await supabase
        .from('user_clients')
        .insert(
          selectedClients.map(client => ({
            user_id: user.id,
            client
          }))
        );

      if (clientsError) {
        console.error("Clients insert error:", clientsError);
        toast.error("Failed to save client selections");
        return;
      }

      toast.success("Profile setup complete!");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Setup error:", error);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>Position</Label>
        <Select value={position} onValueChange={setPosition}>
          <SelectTrigger>
            <SelectValue placeholder="Select your position" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="activation_executive">Activation Executive</SelectItem>
            <SelectItem value="activation_manager">Activation Manager</SelectItem>
            <SelectItem value="activation_director">Activation Director</SelectItem>
            <SelectItem value="digital_partner">Digital Partner</SelectItem>
          </SelectContent>
        </Select>

        <div className="space-y-2">
          <Label>Select Clients</Label>
          <div className="grid grid-cols-2 gap-2">
            {["oes", "28bsw", "gmhba", "tgg", "nbn", "abn"].map((client) => (
              <Button
                key={client}
                variant={selectedClients.includes(client) ? "default" : "outline"}
                onClick={() => handleClientToggle(client)}
                className="w-full"
              >
                {client.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>

        <Button 
          onClick={handleSubmitAdditionalInfo}
          className="w-full mt-4"
        >
          Complete Setup
        </Button>
      </div>
    </div>
  );
};