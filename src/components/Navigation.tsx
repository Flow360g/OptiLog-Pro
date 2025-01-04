import { User } from "lucide-react";
import { Link } from "react-router-dom";

export function Navigation() {
  return (
    <nav className="w-full bg-[#100c2a] border-b border-white/10 px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/2bf12162-a558-42a5-a7e0-3e07a41c5664.png" 
            alt="OptiLog Pro Logo" 
            className="h-12 w-auto object-contain"
          />
        </Link>

        <div className="flex-1 flex justify-center items-center space-x-8">
          <Link to="/" className="text-white font-semibold">Opti Log</Link>
          <Link to="/dashboard" className="text-white hover:text-primary">Dashboard</Link>
          <Link to="/" className="text-white hover:text-primary">Create Opti</Link>
        </div>
        
        <button 
          className="w-10 h-10 rounded-full flex items-center justify-center gradient-bg"
          aria-label="My Profile"
        >
          <User className="w-5 h-5 text-white" />
        </button>
      </div>
    </nav>
  );
}