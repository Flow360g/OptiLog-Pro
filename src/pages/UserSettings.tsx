import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
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
import { Input } from "@/components/ui/input";
import { Navigation } from "@/components/Navigation";

type UserPosition = Database['public']['Enums']['user_position'];

export default function UserSettings() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [position, setPosition] = useState<UserPosition | ''>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/login");
          return;
        }

        setEmail(user.email || "");

        // Load profile data
        const { data: profile } = await supabase
          .from('profiles')
          .select('position, first_name, last_name')
          .eq('id', user.id)
          .single();

        if (profile) {
          setPosition(profile.position || '');
          setFirstName(profile.first_name || '');
          setLastName(profile.last_name || '');
        }

        // Load clients
        const { data: userClients } = await supabase
          .from('user_clients')
          .select('client')
          .eq('user_id', user.id);

        if (userClients) {
          setSelectedClients(userClients.map(uc => uc.client));
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading user data:", error);
        toast.error("Failed to load user data");
      }
    };

    loadUserData();
  }, [navigate]);

  const handleClientToggle = (client: string) => {
    setSelectedClients(prev => 
      prev.includes(client) 
        ? prev.filter(c => c !== client)
        : [...prev, client]
    );
  };

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("No user found");
        return;
      }

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          position,
          first_name: firstName,
          last_name: lastName
        })
        .eq('id', user.id);

      if (profileError) {
        console.error("Profile update error:", profileError);
        toast.error("Failed to update profile");
        return;
      }

      // Delete existing client associations
      const { error: deleteError } = await supabase
        .from('user_clients')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) {
        console.error("Delete clients error:", deleteError);
        toast.error("Failed to update client selections");
        return;
      }

      // Insert new client associations
      if (selectedClients.length > 0) {
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
      }

      toast.success("Settings updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("An unexpected error occurred");
    }
  };

  if (loading) {
    return (
      <div>
        <Navigation />
        <div className="p-8">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <Navigation />
      <div className="max-w-2xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-8">User Settings</h1>
        
        <div className="space-y-6 bg-white p-6 rounded-lg shadow">
          <div className="space-y-2">
            <Label>Email</Label>
            <div className="text-gray-600">{email}</div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
            />
          </div>

          <div className="space-y-4">
            <Label>Position</Label>
            <Select value={position} onValueChange={(value: UserPosition) => setPosition(value)}>
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
          </div>

          <div className="space-y-4">
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
            onClick={handleSave}
            className="w-full gradient-bg"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}