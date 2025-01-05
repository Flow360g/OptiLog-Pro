import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import UserSettings from "./pages/UserSettings";
import Insights from "./pages/Insights";
import Index from "./pages/Index";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";

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

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <RouterProvider router={router} />
      <Toaster />
    </SessionContextProvider>
  );
}

export default App;