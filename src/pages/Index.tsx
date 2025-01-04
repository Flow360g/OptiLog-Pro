import { OptimizationForm } from "@/components/OptimizationForm";
import { Navigation } from "@/components/Navigation";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#100c2a]">
      <Navigation />
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-center text-white">
            Create Your Opti
          </h1>
          <p className="text-lg text-gray-400 mb-8 text-center">
            Fill in the form below to log your optimisation
          </p>
          <OptimizationForm />
        </div>
      </div>
    </div>
  );
};

export default Index;