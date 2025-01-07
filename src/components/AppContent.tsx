import { Outlet } from "react-router-dom";
import { Navigation } from "./Navigation";

export function AppContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto py-6 px-4">
        <Outlet />
      </main>
    </div>
  );
}