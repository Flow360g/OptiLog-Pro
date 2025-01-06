import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthForm } from "@/components/auth/AuthForm";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Session check error:", error);
          // Only clear session if there's an error
          await supabase.auth.signOut();
          return;
        }
        
        if (session?.user) {
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Session check error:", error);
        await supabase.auth.signOut();
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate("/dashboard");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white rounded-xl shadow-lg p-8">
        <div>
          <img
            src="/lovable-uploads/9c68987a-3471-45f2-aba3-7030c96833a8.png"
            alt="OptiLog Pro Logo"
            className="mx-auto h-24 w-auto"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-8">
          <AuthForm />
        </div>
      </div>
    </div>
  );
};

export default Login;