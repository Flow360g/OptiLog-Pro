import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { NavLinks } from "./navigation/NavLinks";
import { UserMenu } from "./navigation/UserMenu";
import { MobileNav } from "./navigation/MobileNav";
import { useToast } from "@/hooks/use-toast";

export function Navigation() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session error:", error);
          if (mounted) {
            setUserEmail(null);
            await supabase.auth.signOut();
            localStorage.removeItem('supabase.auth.token');
            navigate("/login");
          }
          return;
        }
        
        if (!session) {
          if (mounted) {
            setUserEmail(null);
            navigate("/login");
          }
          return;
        }

        if (mounted) {
          setUserEmail(session.user.email);
        }
      } catch (error) {
        console.error("Session check error:", error);
        if (mounted) {
          setUserEmail(null);
          await supabase.auth.signOut();
          localStorage.removeItem('supabase.auth.token');
          navigate("/login");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Initial session check
    checkSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT') {
        setUserEmail(null);
        setIsLoading(false);
        navigate("/login");
        return;
      }

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session) {
          setUserEmail(session.user.email);
          setIsLoading(false);
        } else {
          setUserEmail(null);
          await supabase.auth.signOut();
          localStorage.removeItem('supabase.auth.token');
          navigate("/login");
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="w-full bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/9c68987a-3471-45f2-aba3-7030c96833a8.png" 
              alt="OptiLog Pro Logo" 
              className="h-16 w-auto object-contain"
            />
          </Link>
          <div className="animate-pulse h-8 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

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
        <MobileNav 
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          userEmail={userEmail}
        />

        {/* Desktop User Menu */}
        <div className="hidden md:flex items-center gap-2">
          <UserMenu userEmail={userEmail} />
        </div>
      </div>
    </nav>
  );
}