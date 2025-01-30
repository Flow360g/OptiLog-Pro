import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-secondary/10">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">
          Ready to Transform Your Marketing Process?
        </h2>
        <p className="text-xl mb-8 text-gray-600">
          Join leading marketers who are already using OptiLog Pro to drive better results.
        </p>
        <Button 
          onClick={() => navigate("/login")} 
          variant="gradient"
        >
          Get Started Now <Zap className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </section>
  );
}