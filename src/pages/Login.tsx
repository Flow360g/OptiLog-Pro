import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AdditionalFields } from "@/components/auth/AdditionalFields";
import { AuthForm } from "@/components/auth/AuthForm";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Session check error:", error);
        return;
      }
      if (session) {
        navigate("/", { replace: true });
      }
    };
    
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && !showAdditionalFields) {
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('position')
            .single();
          
          if (error) {
            console.error("Profile fetch error:", error);
            toast.error("Error checking profile status");
            return;
          }

          if (profile?.position) {
            navigate("/", { replace: true });
          } else {
            setShowAdditionalFields(true);
          }
        } catch (error) {
          console.error("Auth state change error:", error);
          toast.error("An unexpected error occurred");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, showAdditionalFields]);

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
          
          {showAdditionalFields ? <AdditionalFields /> : <AuthForm />}
        </div>
      </div>
    </div>
  );
};

export default Login;