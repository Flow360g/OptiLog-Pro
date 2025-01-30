import { Brain, GitBranch, BarChart2, LineChart, FileText, Settings } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="glass-card p-6 hover:scale-105 transition-transform duration-300">
    <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export function FeaturesSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-secondary/10">
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
  );
}