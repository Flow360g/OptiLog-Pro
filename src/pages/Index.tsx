import { OptimizationForm } from "@/components/OptimizationForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#100c2a] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center mb-12">
          <img 
            src="/lovable-uploads/2bf12162-a558-42a5-a7e0-3e07a41c5664.png" 
            alt="OptiLog Pro Logo" 
            className="h-50 w-auto object-contain" // Increased size by 25%
          />
        </div>
        <OptimizationForm />
      </div>
    </div>
  );
};

export default Index;