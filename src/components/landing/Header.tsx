import { Button } from "@/components/ui/button";
import { ArrowRight, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

export function Header({ isMobileMenuOpen, setIsMobileMenuOpen }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="py-2 md:py-4 px-6">
      <div className="max-w-7xl mx-auto">
        <nav className="px-4 py-2 flex justify-between items-center">
          <div className="flex-1 flex justify-center">
            <img 
              src="/lovable-uploads/9c68987a-3471-45f2-aba3-7030c96833a8.png" 
              alt="OptiLog Pro Logo" 
              className="h-28 md:h-12 w-auto"
            />
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <a href="#pricing" className="nav-link">Pricing</a>
            <a href="#features" className="nav-link">Features</a>
            <a href="#about" className="nav-link">About</a>
            <Button 
              onClick={() => navigate("/login")} 
              variant="gradient" 
              className="ml-4"
            >
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-24 left-4 right-4 glass-nav px-4 py-4 flex flex-col gap-2 z-50">
            <a 
              href="/pricing"
              className="nav-link text-center py-3"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </a>
            <a 
              href="#features" 
              className="nav-link text-center py-3"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </a>
            <Button 
              onClick={() => {
                navigate("/login");
                setIsMobileMenuOpen(false);
              }} 
              variant="gradient" 
              className="w-full mt-2"
            >
              Login
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}