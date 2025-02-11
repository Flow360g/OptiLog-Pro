import { useState, useEffect } from "react";
import { OptimizationForm } from "@/components/OptimizationForm";
import { Navigation } from "@/components/Navigation";
import { WelcomeDialog } from "@/components/WelcomeDialog";
import { supabase } from "@/integrations/supabase/client";
import { LandingPage } from "@/components/landing/LandingPage";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error checking session:", sessionError);
          if (mounted) {
            setSession(null);
            setError("Failed to check authentication status");
            setIsAuthChecking(false);
          }
          return;
        }

        if (mounted) {
          setSession(initialSession);
          setIsAuthChecking(false);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        if (mounted) {
          setSession(null);
          setError("Failed to initialize authentication");
          setIsAuthChecking(false);
          toast({
            title: "Authentication Error",
            description: "There was a problem checking your login status. Please try refreshing the page.",
            variant: "destructive",
          });
        }
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSession(session);
        setIsAuthChecking(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [toast]);

  useEffect(() => {
    const checkFirstTimeUser = async () => {
      setIsProfileLoading(true);
      setError(null);
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('first_name, last_name, position, has_seen_welcome')
            .eq('id', user.id)
            .single();

          if (profileError) {
            console.error("Error fetching profile:", profileError);
            setError("Failed to load user profile");
            toast({
              title: "Profile Error",
              description: "There was a problem loading your profile. Please try refreshing the page.",
              variant: "destructive",
            });
            return;
          }

          if (profile && (!profile.first_name || !profile.last_name || !profile.position) && !profile.has_seen_welcome) {
            setShowWelcomeDialog(true);
          }
        }
      } catch (error) {
        console.error("Error checking user profile:", error);
        setError("Failed to check user profile");
        toast({
          title: "Profile Error",
          description: "There was a problem checking your profile. Please try refreshing the page.",
          variant: "destructive",
        });
      } finally {
        setIsProfileLoading(false);
      }
    };

    if (session) {
      checkFirstTimeUser();
    } else {
      setIsProfileLoading(false);
    }
  }, [session, toast]);

  if (isAuthChecking || isProfileLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-600">
          {isAuthChecking ? "Checking authentication..." : "Loading profile..."}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary/90 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

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