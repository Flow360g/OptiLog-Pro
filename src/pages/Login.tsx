import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
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

const Login = () => {
  const navigate = useNavigate();
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [position, setPosition] = useState<string>("");

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/", { replace: true });
      }
    };
    
    checkUser();

    // Listen for signup events to show additional fields
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        navigate("/", { replace: true });
      } else if (event === 'SIGNUP') {
        setShowAdditionalFields(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleClientToggle = (client: string) => {
    setSelectedClients(prev => 
      prev.includes(client) 
        ? prev.filter(c => c !== client)
        : [...prev, client]
    );
  };

  const handleSubmitAdditionalInfo = async () => {
    if (!position || selectedClients.length === 0) {
      toast.error("Please select both position and at least one client");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Update user metadata with position
    const { error: updateError } = await supabase.auth.updateUser({
      data: { position }
    });

    if (updateError) {
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
      toast.error("Failed to save client selections");
      return;
    }

    toast.success("Profile setup complete!");
    navigate("/", { replace: true });
  };

  if (showAdditionalFields) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
        <div className="w-full max-w-md z-10">
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-xl shadow-xl space-y-6">
            <div className="flex justify-center mb-8">
              <img 
                src="/lovable-uploads/9c68987a-3471-45f2-aba3-7030c96833a8.png" 
                alt="OptiLog Pro Logo" 
                className="h-16 w-auto"
              />
            </div>
            
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
      <div className="w-full max-w-md z-10">
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-xl shadow-xl">
          <div className="flex justify-center mb-8">
            <img 
              src="/lovable-uploads/9c68987a-3471-45f2-aba3-7030c96833a8.png" 
              alt="OptiLog Pro Logo" 
              className="h-16 w-auto"
            />
          </div>
          
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#2A6FEE',
                    brandAccent: '#2A6FEE',
                    brandButtonText: 'white',
                  },
                },
                google: {
                  colors: {
                    brand: '#f0f0f0',
                    brandAccent: '#f0f0f0',
                    brandButtonText: '#000',
                  },
                },
              },
              className: {
                anchor: 'text-gray-500 hover:text-gray-700',
                container: 'gap-3',
                divider: 'bg-gray-300',
                label: 'text-gray-700',
                input: 'bg-white border-gray-300 text-gray-900',
                loader: 'text-gray-500',
                message: 'text-gray-500',
              },
            }}
            providers={["google"]}
            redirectTo={window.location.origin}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;