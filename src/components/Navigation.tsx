import { User, LogOut, Settings } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  
  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Session error:", error);
        navigate("/login");
        return;
      }
      
      if (!session) {
        navigate("/login");
        return;
      }

      setUserEmail(session.user.email);
    };

    checkSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate("/login");
        return;
      }
      
      if (session) {
        setUserEmail(session.user.email);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };
  
  return (
    <nav className="w-full bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/9c68987a-3471-45f2-aba3-7030c96833a8.png" 
            alt="OptiLog Pro Logo" 
            className="h-16 w-auto object-contain"
          />
        </Link>

        <div className="flex-1 flex justify-center items-center space-x-8 h-14">
          <Link 
            to="/dashboard" 
            className={`text-gray-600 hover:text-primary ${location.pathname === '/dashboard' ? 'font-bold' : ''} flex items-center h-full`}
          >
            Dashboard
          </Link>
          <Link 
            to="/insights" 
            className={`text-gray-600 hover:text-primary ${location.pathname === '/insights' ? 'font-bold' : ''} flex items-center h-full`}
          >
            Insights
          </Link>
          <Link 
            to="/" 
            className="border-2 border-primary rounded-full px-4 py-1 text-gray-600 hover:text-primary flex items-center h-fit"
          >
            Create Opti
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="p-2 rounded-full gradient-bg"
                aria-label="User menu"
              >
                <User className="w-6 h-6 text-white" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {userEmail && (
                <DropdownMenuItem className="text-sm text-gray-500">
                  {userEmail}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                User Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}