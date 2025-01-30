import { useState, useEffect } from "react";
import { OptimizationForm } from "@/components/OptimizationForm";
import { Navigation } from "@/components/Navigation";
import { WelcomeDialog } from "@/components/WelcomeDialog";
import { supabase } from "@/integrations/supabase/client";
import { LandingPage } from "@/components/landing/LandingPage";

const Index = () => {
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    // Check if we have an existing session
    const existingSession = supabase.auth.session();
    if (!existingSession) {
      setIsAuthChecking(false);
      return;
    }

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsAuthChecking(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsAuthChecking(false);
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

    if (session) {
      checkFirstTimeUser();
    }
  }, [session]);

  // If we're not checking auth and there's no session, show landing page immediately
  if (!isAuthChecking && !session) {
    return <LandingPage />;
  }

  // Show loading state only when checking auth for a potential existing session
  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show authenticated content
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