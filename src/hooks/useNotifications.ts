import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: string;
  message: string;
  client?: string;
  platform?: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchNotifications = async () => {
    try {
      // For demonstration purposes, we'll add some example notifications
      const exampleNotifications: Notification[] = [
        {
          id: "inactive_client_1",
          type: "inactive_client",
          message: "You haven't logged any optimisations for Nike in over 7 days.",
          client: "Nike"
        },
        {
          id: "low_activity_client_1",
          type: "low_client_activity",
          message: "Adidas might need more attention, it has made up less than 10% of your optimisations logged last month.",
          client: "Adidas"
        },
        {
          id: "low_platform_1",
          type: "low_platform_activity",
          message: "TikTok is receiving less than 20% of your total optimisations logged. Consider focusing more on this channel.",
          platform: "TikTok"
        }
      ];

      setNotifications(exampleNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const dismissNotification = async (notification: Notification) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error("No authenticated user found");
        return;
      }

      const { error } = await supabase
        .from("dismissed_notifications")
        .insert({
          notification_type: notification.type,
          client: notification.client,
          platform: notification.platform,
          user_id: user.id
        });

      if (error) throw error;

      setNotifications(prev => prev.filter(n => n.id !== notification.id));
      toast({
        description: "Notification dismissed",
      });
    } catch (error) {
      console.error("Error dismissing notification:", error);
      toast({
        title: "Error",
        description: "Failed to dismiss notification",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return {
    notifications,
    loading,
    dismissNotification
  };
};