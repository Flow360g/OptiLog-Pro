import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Header } from "@/components/landing/Header";
import { useState } from "react";

const Pricing = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20">
      <Header 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <div className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
            <p className="text-xl text-gray-600">Choose the plan that's right for you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <h2 className="text-2xl font-bold mb-4">Starter</h2>
              <p className="text-4xl font-bold mb-6">$49<span className="text-lg text-gray-500">/month</span></p>
              <ul className="space-y-4 mb-8">
                <PricingFeature text="Up to 3 clients" />
                <PricingFeature text="Basic optimization tracking" />
                <PricingFeature text="Standard reports" />
                <PricingFeature text="Email support" />
              </ul>
              <Button variant="outline" className="w-full">Get Started</Button>
            </div>

            {/* Professional Plan */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm">
                Most Popular
              </div>
              <h2 className="text-2xl font-bold mb-4">Professional</h2>
              <p className="text-4xl font-bold mb-6">$99<span className="text-lg text-gray-500">/month</span></p>
              <ul className="space-y-4 mb-8">
                <PricingFeature text="Up to 10 clients" />
                <PricingFeature text="Advanced optimization tracking" />
                <PricingFeature text="Custom reports" />
                <PricingFeature text="Priority email support" />
                <PricingFeature text="AI-powered suggestions" />
              </ul>
              <Button variant="gradient" className="w-full">Get Started</Button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <h2 className="text-2xl font-bold mb-4">Enterprise</h2>
              <p className="text-4xl font-bold mb-6">$249<span className="text-lg text-gray-500">/month</span></p>
              <ul className="space-y-4 mb-8">
                <PricingFeature text="Unlimited clients" />
                <PricingFeature text="Custom optimization workflows" />
                <PricingFeature text="White-label reports" />
                <PricingFeature text="24/7 phone support" />
                <PricingFeature text="Dedicated account manager" />
                <PricingFeature text="Custom AI training" />
              </ul>
              <Button variant="outline" className="w-full">Contact Sales</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PricingFeature = ({ text }: { text: string }) => (
  <li className="flex items-center gap-2">
    <Check className="h-5 w-5 text-primary" />
    <span>{text}</span>
  </li>
);

export default Pricing;