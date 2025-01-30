import { useState, useEffect } from "react";
import { OptimizationForm } from "@/components/OptimizationForm";
import { Navigation } from "@/components/Navigation";
import { WelcomeDialog } from "@/components/WelcomeDialog";
import { supabase } from "@/integrations/supabase/client";
import { LandingPage } from "@/components/landing/LandingPage";

const Index = () => {
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const checkFirstTimeUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name, last_name, position, has_seen_welcome')
            .eq('id', user.id)
            .single();

          if (profile && (!profile.first_name || !profile.last_name || !profile.position) && !profile.has_seen_welcome) {
            setShowWelcomeDialog(true);
          }
        }
      } catch (error) {
        console.error("Error checking user profile:", error);
      }
    };

    checkFirstTimeUser();
  }, []);

  if (!session) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20">
      <Navigation />
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-center text-gray-900">
            Create Your Opti
          </h1>
          <p className="text-lg text-gray-600 mb-8 text-center">
            Fill in the form below to log your optimisation
          </p>
          <OptimizationForm />
        </div>
      </div>
      <WelcomeDialog 
        open={showWelcomeDialog} 
        onOpenChange={setShowWelcomeDialog}
      />
    </div>
  );
};

export default Index;