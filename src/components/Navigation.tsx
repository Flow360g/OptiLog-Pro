import { User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function Navigation() {
  const location = useLocation();
  
  return (
    <nav className="w-full bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/9c68987a-3471-45f2-aba3-7030c96833a8.png" 
            alt="OptiLog Pro Logo" 
            className="h-14 w-auto object-contain"
          />
        </Link>

        <div className="flex-1 flex justify-center items-center space-x-8 h-14">
          <Link 
            to="/" 
            className={`text-gray-900 ${location.pathname === '/' ? 'font-bold' : ''} flex items-center h-full`}
          >
            Opti Log
          </Link>
          <Link 
            to="/dashboard" 
            className={`text-gray-600 hover:text-primary ${location.pathname === '/dashboard' ? 'font-bold' : ''} flex items-center h-full`}
          >
            Dashboard
          </Link>
          <Link 
            to="/" 
            className="border-2 border-primary rounded-full px-4 py-1 text-gray-600 hover:text-primary flex items-center h-fit"
          >
            Create Opti
          </Link>
        </div>
        
        <button 
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="User menu"
        >
          <User className="w-6 h-6 text-gray-600" />
        </button>
      </div>
    </nav>
  );
}