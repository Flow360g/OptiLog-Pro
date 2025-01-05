import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { SettingsForm } from "@/components/settings/SettingsForm";
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useUserClients } from "@/hooks/useUserClients";

export default function UserSettings() {
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

  if (isSessionLoading || isClientsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20">
        <Navigation />
        <div className="p-8">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20">
      <Navigation />
      <div className="max-w-2xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-8">User Settings</h1>
        {session && (
          <SettingsForm 
            userId={session.user.id}
            userClients={userClients}
          />
        )}
      </div>
    </div>
  );
}