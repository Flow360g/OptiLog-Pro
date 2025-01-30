import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Brain, GitBranch, BarChart2, LineChart, FileText, Settings, Zap } from "lucide-react";

export const LandingPage = () => {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="py-4 px-6">
        <div className="max-w-7xl mx-auto">
          <nav className="glass-nav px-4 py-2 flex justify-between items-center">
            <div className="flex-1 flex justify-center">
              <img 
                src="/lovable-uploads/9c68987a-3471-45f2-aba3-7030c96833a8.png" 
                alt="OptiLog Pro Logo" 
                className="h-12 w-auto"
              />
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <a href="#pricing" className="nav-link">Pricing</a>
              <a href="#features" className="nav-link">Features</a>
              <a href="#about" className="nav-link">About</a>
              <Button onClick={handleLogin} className="hero-button ml-4">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4">
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 blur-3xl" />
          </div>
          <div className="inline-block px-6 py-2 rounded-full bg-primary/10 text-primary mb-6">
            Unlock Your Marketing Potential
          </div>
          <h1 className="text-6xl font-bold mb-6 leading-tight">
            Fastest & Easiest Way to
            <span className="gradient-text block">Optimize Marketing</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            The central hub for logging, tracking, and automating your marketing optimization workflow. 
            Turn insights into impact with AI-powered suggestions.
          </p>
          <Button onClick={handleLogin} className="hero-button">
            Start 7 Days Trial <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Brain className="h-6 w-6 text-primary" />}
              title="AI-Powered Suggestions"
              description="Get intelligent optimization recommendations based on your platform and KPIs."
            />
            <FeatureCard
              icon={<GitBranch className="h-6 w-6 text-primary" />}
              title="Test Library"
              description="Access a comprehensive library of proven test templates."
            />
            <FeatureCard
              icon={<BarChart2 className="h-6 w-6 text-primary" />}
              title="Impact Scoring"
              description="Automatically prioritize optimizations based on effort and impact."
            />
            <FeatureCard
              icon={<LineChart className="h-6 w-6 text-primary" />}
              title="Performance Tracking"
              description="Monitor success with detailed analytics and insights."
            />
            <FeatureCard
              icon={<FileText className="h-6 w-6 text-primary" />}
              title="One-Click Reports"
              description="Generate professional PDF reports with a single click."
            />
            <FeatureCard
              icon={<Settings className="h-6 w-6 text-primary" />}
              title="Workflow Automation"
              description="Streamline your optimization process systematically."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Transform Your Marketing Process?
          </h2>
          <p className="text-xl mb-8 text-gray-600">
            Join leading marketers who are already using OptiLog Pro to drive better results.
          </p>
          <Button 
            onClick={handleLogin} 
            className="hero-button"
          >
            Get Started Now <Zap className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
}) => (
  <div className="glass-card p-6 hover:scale-105 transition-transform duration-300">
    <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);
