import { User } from "lucide-react";
import { Link } from "react-router-dom";

export function Navigation() {
  return (
    <nav className="w-full bg-[#100c2a] border-b border-white/10 px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-8">
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