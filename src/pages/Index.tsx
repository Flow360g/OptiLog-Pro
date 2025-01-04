import { OptimizationForm } from "@/components/OptimizationForm";
import { Navigation } from "@/components/Navigation";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#100c2a]">
      <Navigation />
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Create Your Opti
          </h1>
          <OptimizationForm />
        </div>
      </div>
    </div>
  );
};

export default Index;