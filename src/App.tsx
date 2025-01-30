import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createClient } from '@supabase/supabase-js';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import { supabase } from "./integrations/supabase/client";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Index from "./pages/Index";
import UserSettings from "./pages/UserSettings";
import TestingSchedule from "./pages/TestingSchedule";
import CreateTest from "./pages/CreateTest";
import Insights from "./pages/Insights";
import GoogleRsaOptimiser from "./pages/GoogleRsaOptimiser";
import { ErrorBoundary } from "./components/ErrorBoundary";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <ErrorBoundary>
          <Router>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Index />} />
              <Route path="/settings" element={<UserSettings />} />
              <Route path="/testing-schedule" element={<TestingSchedule />} />
              <Route path="/create-test" element={<CreateTest />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/rsa-optimiser" element={<GoogleRsaOptimiser />} />
            </Routes>
          </Router>
          <Toaster />
        </ErrorBoundary>
      </SessionContextProvider>
    </QueryClientProvider>
  );
}

export default App;