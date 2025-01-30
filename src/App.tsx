import {
  BrowserRouter as Router,
  Routes,
  Route,
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

// Protected Route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Show loading spinner while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} errorElement={<ErrorBoundary />} />
        <Route path="/login" element={<Login />} errorElement={<ErrorBoundary />} />
        <Route path="/pricing" element={<Pricing />} errorElement={<ErrorBoundary />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
          errorElement={<ErrorBoundary />}
        />
        <Route
          path="/insights"
          element={
            <ProtectedRoute>
              <Insights />
            </ProtectedRoute>
          }
          errorElement={<ErrorBoundary />}
        />
        <Route
          path="/testing-schedule"
          element={
            <ProtectedRoute>
              <TestingSchedule />
            </ProtectedRoute>
          }
          errorElement={<ErrorBoundary />}
        />
        <Route
          path="/testing-schedule/new"
          element={
            <ProtectedRoute>
              <CreateTest />
            </ProtectedRoute>
          }
          errorElement={<ErrorBoundary />}
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <UserSettings />
            </ProtectedRoute>
          }
          errorElement={<ErrorBoundary />}
        />
        <Route
          path="/tools/rsa-optimiser"
          element={
            <ProtectedRoute>
              <GoogleRsaOptimiser />
            </ProtectedRoute>
          }
          errorElement={<ErrorBoundary />}
        />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;