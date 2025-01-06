import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { createBrowserRouter, RouterProvider, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import UserSettings from "./pages/UserSettings";
import Insights from "./pages/Insights";
import Index from "./pages/Index";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from "react";

// Title updater component
function TitleUpdater() {
  const location = useLocation();

  useEffect(() => {
    const pageTitles: { [key: string]: string } = {
      '/': 'Create Opti',
      '/dashboard': 'Dashboard',
      '/login': 'Login',
      '/settings': 'User Settings',
      '/insights': 'Insights'
    };

    const pageTitle = pageTitles[location.pathname] || '';
    document.title = pageTitle ? `OptiLog Pro | ${pageTitle}` : 'OptiLog Pro';
  }, [location]);

  return null;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/settings",
    element: <UserSettings />,
  },
  {
    path: "/insights",
    element: <Insights />,
  },
]);

// Create a client
const queryClient = new QueryClient();

// Wrapper component to include TitleUpdater
function AppContent() {
  return (
    <>
      <RouterProvider router={router} />
      <TitleUpdater />
      <Toaster />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <AppContent />
      </SessionContextProvider>
    </QueryClientProvider>
  );
}

export default App;