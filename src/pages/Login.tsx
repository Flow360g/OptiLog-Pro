import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/", { replace: true });
      }
    };
    
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate("/", { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[100%] animate-[spin_20s_linear_infinite] opacity-50">
          <div className="absolute top-1/2 left-1/2 w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-3xl"/>
        </div>
      </div>
      
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
                    brand: 'transparent',
                    brandAccent: 'transparent',
                    brandButtonText: 'white',
                    inputText: 'white',
                  },
                  borderWidths: {
                    buttonBorderWidth: '0px',
                  },
                  radii: {
                    borderRadiusButton: '0.75rem',
                  },
                },
              },
              className: {
                button: 'gradient-bg',
                anchor: 'text-gray-500 hover:text-gray-700',
                container: 'gap-3',
                divider: 'bg-gray-300',
                label: 'text-gray-700',
                input: 'bg-white border-gray-300 text-gray-900',
                loader: 'text-gray-500',
                message: 'text-gray-500',
                socialButton: 'bg-gray-200 hover:bg-gray-300 text-gray-700',
                socialButtonText: 'text-gray-700 font-medium',
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