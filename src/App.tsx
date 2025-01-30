import {
  BrowserRouter as Router,
  Routes,
  Route,
  useRoutes,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Insights from "./pages/Insights";
import TestingSchedule from "./pages/TestingSchedule";
import CreateTest from "./pages/CreateTest";
import UserSettings from "./pages/UserSettings";
import GoogleRsaOptimiser from "./pages/GoogleRsaOptimiser";
import Pricing from "./pages/Pricing";
import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from "@/components/ErrorBoundary";
import { supabase } from "@/integrations/supabase/client";

function AppRoutes({ isAuthenticated, isLoading }: { isAuthenticated: boolean, isLoading: boolean }) {
  const routes = useRoutes([
    {
      path: "/",
      element: isLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : isAuthenticated ? (
        <Index />
      ) : (
        <Navigate to="/login" replace />
      ),
      errorElement: <ErrorBoundary />,
    },
    {
      path: "/login",
      element: isAuthenticated ? <Navigate to="/" replace /> : <Login />,
      errorElement: <ErrorBoundary />,
    },
    {
      path: "/dashboard",
      element: isLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : isAuthenticated ? (
        <Dashboard />
      ) : (
        <Navigate to="/login" replace />
      ),
      errorElement: <ErrorBoundary />,
    },
    {
      path: "/insights",
      element: isLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : isAuthenticated ? (
        <Insights />
      ) : (
        <Navigate to="/login" replace />
      ),
      errorElement: <ErrorBoundary />,
    },
    {
      path: "/testing-schedule",
      element: isLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : isAuthenticated ? (
        <TestingSchedule />
      ) : (
        <Navigate to="/login" replace />
      ),
      errorElement: <ErrorBoundary />,
    },
    {
      path: "/testing-schedule/new",
      element: isLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : isAuthenticated ? (
        <CreateTest />
      ) : (
        <Navigate to="/login" replace />
      ),
      errorElement: <ErrorBoundary />,
    },
    {
      path: "/settings",
      element: isLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : isAuthenticated ? (
        <UserSettings />
      ) : (
        <Navigate to="/login" replace />
      ),
      errorElement: <ErrorBoundary />,
    },
    {
      path: "/tools/rsa-optimiser",
      element: isLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : isAuthenticated ? (
        <GoogleRsaOptimiser />
      ) : (
        <Navigate to="/login" replace />
      ),
      errorElement: <ErrorBoundary />,
    },
    {
      path: "/pricing",
      element: <Pricing />,
      errorElement: <ErrorBoundary />,
    },
  ]);

  return routes;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Clear any stale session data on mount
    const clearStaleSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        console.log("Clearing session due to error or no session");
        await supabase.auth.signOut();
        localStorage.removeItem('supabase.auth.token');
        setIsAuthenticated(false);
      }
    };

    clearStaleSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, !!session);
      
      if (event === 'SIGNED_OUT') {
        // Handle sign out
        setIsAuthenticated(false);
        localStorage.removeItem('supabase.auth.token');
        console.log("User signed out");
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session) {
          setIsAuthenticated(true);
          console.log("User signed in");
        } else {
          // If we get a sign in event but no session, something's wrong
          console.log("Sign in event but no session");
          await supabase.auth.signOut();
          setIsAuthenticated(false);
          localStorage.removeItem('supabase.auth.token');
        }
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <Router>
      <AppRoutes isAuthenticated={isAuthenticated} isLoading={isLoading} />
      <Toaster />
    </Router>
  );
}

export default App;