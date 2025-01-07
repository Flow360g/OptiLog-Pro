import { Toaster } from "@/components/ui/toaster";
import { createBrowserRouter, RouterProvider, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import UserSettings from "./pages/UserSettings";
import Insights from "./pages/Insights";
import Index from "./pages/Index";
import TestingSchedule from "./pages/TestingSchedule";
import ErrorBoundary from "./components/ErrorBoundary";
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
      '/insights': 'Insights',
      '/testing-schedule': 'Testing Schedule',
      '/testing-schedule/new': 'Create New Test'
    };

    const pageTitle = pageTitles[location.pathname] || '';
    document.title = pageTitle ? `OptiLog Pro | ${pageTitle}` : 'OptiLog Pro';
  }, [location]);

  return null;
}

// Create a wrapper component for each route that includes TitleUpdater
const withTitleUpdate = (Component: React.ComponentType) => {
  return function WithTitleUpdate() {
    return (
      <>
        <TitleUpdater />
        <Component />
      </>
    );
  };
};

const router = createBrowserRouter([
  {
    path: "/",
    element: withTitleUpdate(Index)(),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/dashboard",
    element: withTitleUpdate(Dashboard)(),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/login",
    element: withTitleUpdate(Login)(),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/settings",
    element: withTitleUpdate(UserSettings)(),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/insights",
    element: withTitleUpdate(Insights)(),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/testing-schedule",
    element: withTitleUpdate(TestingSchedule)(),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/testing-schedule/new",
    element: withTitleUpdate(TestingSchedule)(),
    errorElement: <ErrorBoundary />,
  },
]);

// Create a client
const queryClient = new QueryClient();

function AppContent() {
  return (
    <>
      <RouterProvider router={router} />
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