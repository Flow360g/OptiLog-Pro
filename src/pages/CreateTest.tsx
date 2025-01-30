import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { TestForm } from "@/components/TestForm";
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useUserClients } from "@/hooks/useUserClients";

export default function CreateTest() {
  const navigate = useNavigate();
  const { session, isLoading: isSessionLoading } = useSessionContext();
  const { data: userClients = [], isLoading: isClientsLoading } = useUserClients();

  // Check session and redirect if not logged in
  useEffect(() => {
    if (!isSessionLoading && !session) {
      navigate("/login");
      return;
    }
  }, [session, isSessionLoading, navigate]);

  // Only show loading state while checking session
  if (isSessionLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20">
        <Navigation />
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // If no session, redirect to login
  if (!session) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20">
      <Navigation />
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-center text-gray-900">
            Create Test
          </h1>
          <p className="text-lg text-gray-600 mb-8 text-center">
            Fill in the form below to create a new test
          </p>
          {isClientsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading client data...</p>
            </div>
          ) : userClients.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No clients assigned. Please update your settings.</p>
            </div>
          ) : (
            <TestForm />
          )}
        </div>
      </div>
    </div>
  );
}