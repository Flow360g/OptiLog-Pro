import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AppContent } from "@/components/AppContent";
import Dashboard from "@/pages/Dashboard";
import Insights from "@/pages/Insights";
import Login from "@/pages/Login";
import Tests from "@/pages/Tests";
import { OptimizationForm } from "@/components/OptimizationForm";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppContent />,
    children: [
      {
        path: "/",
        element: <OptimizationForm />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/insights",
        element: <Insights />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/tests",
        element: <Tests />,
      },
    ],
  },
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  );
}