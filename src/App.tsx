import {
  BrowserRouter as Router,
  Routes,
  Route,
  useRoutes,
} from "react-router-dom";
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

function AppRoutes() {
  const routes = useRoutes([
    {
      path: "/",
      element: <Index />,
      errorElement: <ErrorBoundary />,
    },
    {
      path: "/login",
      element: <Login />,
      errorElement: <ErrorBoundary />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
      errorElement: <ErrorBoundary />,
    },
    {
      path: "/insights",
      element: <Insights />,
      errorElement: <ErrorBoundary />,
    },
    {
      path: "/testing-schedule",
      element: <TestingSchedule />,
      errorElement: <ErrorBoundary />,
    },
    {
      path: "/testing-schedule/new",
      element: <CreateTest />,
      errorElement: <ErrorBoundary />,
    },
    {
      path: "/settings",
      element: <UserSettings />,
      errorElement: <ErrorBoundary />,
    },
    {
      path: "/tools/rsa-optimiser",
      element: <GoogleRsaOptimiser />,
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
  return (
    <Router>
      <AppRoutes />
      <Toaster />
    </Router>
  );
}

export default App;