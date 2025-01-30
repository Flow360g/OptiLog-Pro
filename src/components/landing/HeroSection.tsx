import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="pt-8 md:pt-20 pb-32 px-4">
      <div className="max-w-5xl mx-auto text-center relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 blur-3xl" />
        </div>
        <div className="inline-block px-6 py-2 rounded-full bg-primary/10 text-primary mb-6">
          Unlock Your Marketing Potential
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Fastest & Easiest Way to
          <span className="gradient-text block">Optimize Marketing</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          The central hub for logging, tracking, and automating your marketing optimization workflow. 
          Turn insights into impact with AI-powered suggestions.
        </p>
        <Button onClick={() => navigate("/login")} variant="gradient">
          Start 7 Days Trial <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </section>
  );
}