import { createBrowserRouter, RouterProvider } from "react-router-dom";
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

// Create router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/settings",
    element: <UserSettings />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/testing-schedule",
    element: <TestingSchedule />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/create-test",
    element: <CreateTest />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/insights",
    element: <Insights />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/rsa-optimiser",
    element: <GoogleRsaOptimiser />,
    errorElement: <ErrorBoundary />,
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <RouterProvider router={router} />
        <Toaster />
      </SessionContextProvider>
    </QueryClientProvider>
  );
}

export default App;