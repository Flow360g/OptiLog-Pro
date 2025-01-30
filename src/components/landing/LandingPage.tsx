import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, BarChart2, Brain, ClipboardCheck, FileText, GitBranch, LineChart, Settings, Zap } from "lucide-react";

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
    <div className="min-h-screen bg-[#f8f8f8]">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/002f77c4-0d62-47cc-bd9e-b50a29e372af.png" 
                alt="OptiLog Pro Logo" 
                className="h-8 w-auto"
              />
              <span className="ml-2 text-xl font-semibold text-gray-900">OptiLog Pro</span>
            </div>
            <Button onClick={handleLogin} variant="gradient" className="flex items-center gap-2">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Systematize Your Marketing Optimizations
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              The central hub for logging, tracking, and automating your marketing optimization workflow. 
              Turn insights into impact with AI-powered suggestions and data-driven decisions.
            </p>
            <Button onClick={handleLogin} variant="gradient" size="lg" className="flex items-center gap-2 mx-auto">
              Start Optimizing Now <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5" />
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Brain className="h-6 w-6 text-primary" />}
              title="AI-Powered Suggestions"
              description="Get intelligent optimization recommendations based on your platform, KPIs, and historical performance data."
            />
            <FeatureCard
              icon={<GitBranch className="h-6 w-6 text-primary" />}
              title="Test Library"
              description="Access a comprehensive library of proven test templates to accelerate your optimization workflow."
            />
            <FeatureCard
              icon={<BarChart2 className="h-6 w-6 text-primary" />}
              title="Impact Scoring"
              description="Automatically prioritize optimizations based on effort required and potential impact scores."
            />
            <FeatureCard
              icon={<LineChart className="h-6 w-6 text-primary" />}
              title="Performance Tracking"
              description="Monitor the success of your optimizations with detailed analytics and insights."
            />
            <FeatureCard
              icon={<FileText className="h-6 w-6 text-primary" />}
              title="One-Click Reports"
              description="Generate professional PDF reports of your tests and optimizations with a single click."
            />
            <FeatureCard
              icon={<Settings className="h-6 w-6 text-primary" />}
              title="Workflow Automation"
              description="Streamline your optimization process with automated suggestions and systematic learning."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Transform Your Marketing Optimization Process?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join leading marketers who are already using OptiLog Pro to drive better results.
          </p>
          <Button 
            onClick={handleLogin} 
            variant="outline" 
            size="lg"
            className="bg-white text-primary hover:bg-white/90 flex items-center gap-2 mx-auto"
          >
            Get Started Now <Zap className="h-5 w-5" />
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
  <div className="p-6 rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
    <div className="mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);