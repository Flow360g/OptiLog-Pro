import { useState, useEffect } from "react";
import { OptimizationForm } from "@/components/OptimizationForm";
import { Navigation } from "@/components/Navigation";
import { WelcomeDialog } from "@/components/WelcomeDialog";
import { supabase } from "@/integrations/supabase/client";
import { HeroSection } from "@/components/ui/hero-section";

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

  if (!session) {
    return (
      <HeroSection
        title="Unlock Your Marketing Potential"
        subtitle={{
          regular: "The fastest way to ",
          gradient: "optimize marketing",
        }}
        description="The central hub for logging, tracking, and automating your marketing optimization workflow. Turn insights into impact with AI-powered suggestions."
        ctaText="Start 7 Days Trial"
        ctaHref="#"
        bottomImage={{
          light: "/lovable-uploads/002f77c4-0d62-47cc-bd9e-b50a29e372af.png",
          dark: "/lovable-uploads/002f77c4-0d62-47cc-bd9e-b50a29e372af.png"
        }}
        gridOptions={{
          angle: 65,
          opacity: 0.3,
          cellSize: 50,
          lightLineColor: "#9b87f5",
          darkLineColor: "#7E69AB",
        }}
      />
    );
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