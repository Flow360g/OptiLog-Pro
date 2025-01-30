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
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Session error:", error);
          setIsAuthenticated(false);
          return;
        }
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error("Session check error:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial session check
    checkSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
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