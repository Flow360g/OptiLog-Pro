import { OptimizationForm } from "@/components/OptimizationForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0B1F] from-70% via-[#0A0B1F] via-75% to-[#2B95CE] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center mb-12">
          <img 
            src="/lovable-uploads/29b5965d-9225-4552-9863-195736b717cc.png" 
            alt="OptiLog Pro Logo" 
            className="h-32 w-auto object-contain"
          />
        </div>
        <OptimizationForm />
      </div>
    </div>
  );
};

export default Index;