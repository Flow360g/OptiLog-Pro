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
    // Public routes - accessible without authentication
    {
      path: "/",
      element: <Index />,
      errorElement: <ErrorBoundary />,
    },
    {
      path: "/login",
      element: isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />,
      errorElement: <ErrorBoundary />,
    },
    {
      path: "/pricing",
      element: <Pricing />,
      errorElement: <ErrorBoundary />,
    },
    // Protected routes - require authentication
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
  ]);

  return routes;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, !!session);
      
      if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setIsAuthenticated(!!session);
      }
      
      setIsLoading(false);
    });

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
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
