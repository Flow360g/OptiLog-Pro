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
  const { toast } = useToast();
  
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session error:", error);
          await supabase.auth.signOut();
          navigate("/login");
          return;
        }
        
        if (!session) {
          navigate("/login");
          return;
        }

        setUserEmail(session.user.email);
      } catch (error) {
        console.error("Session check error:", error);
        await supabase.auth.signOut();
        navigate("/login");
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setUserEmail(null);
        navigate("/login");
        return;
      }
      
      if (session) {
        try {
          const { data: { user }, error } = await supabase.auth.getUser();
          if (error) throw error;
          setUserEmail(user?.email || null);
        } catch (error) {
          console.error("Error getting user:", error);
          toast({
            title: "Error",
            description: "There was a problem with your session. Please log in again.",
            variant: "destructive",
          });
          await supabase.auth.signOut();
          navigate("/login");
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

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