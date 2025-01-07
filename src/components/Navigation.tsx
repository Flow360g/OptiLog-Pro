import { User, LogOut, Settings, Menu } from "lucide-react";
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  
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

  const NavLinks = () => (
    <>
      <Link 
        to="/dashboard" 
        className={`text-gray-600 hover:text-primary ${location.pathname === '/dashboard' ? 'font-bold' : ''}`}
        onClick={() => setIsOpen(false)}
      >
        Dashboard
      </Link>
      <Link 
        to="/insights" 
        className={`text-gray-600 hover:text-primary ${location.pathname === '/insights' ? 'font-bold' : ''}`}
        onClick={() => setIsOpen(false)}
      >
        Insights
      </Link>
      <Link 
        to="/performance-diagnosis" 
        className={`text-gray-600 hover:text-primary ${location.pathname === '/performance-diagnosis' ? 'font-bold' : ''}`}
        onClick={() => setIsOpen(false)}
      >
        Performance Diagnosis
      </Link>
      <Link 
        to="/" 
        className="border-2 border-primary rounded-full px-4 py-1 text-gray-600 hover:text-primary"
        onClick={() => setIsOpen(false)}
      >
        Create Opti
      </Link>
    </>
  );

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

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 justify-center items-center space-x-8 h-14">
          <NavLinks />
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-1 md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-[2.1rem] w-[2.1rem]" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-8">
                <NavLinks />
              </div>
            </SheetContent>
          </Sheet>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="p-1.5 rounded-full gradient-bg"
                aria-label="User menu"
              >
                <User className="w-[0.85rem] h-[0.85rem] md:w-6 md:h-6 text-white" />
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

        {/* Desktop User Menu */}
        <div className="hidden md:flex items-center gap-2">
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
