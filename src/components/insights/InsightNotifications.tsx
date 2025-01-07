import { useEffect, useState } from "react";
import { AlertCircle, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";

interface Notification {
  id: string;
  type: string;
  message: string;
  client?: string;
  platform?: string;
}

export const InsightNotifications = () => {
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

  useEffect(() => {
    fetchNotifications();
  }, []);

  const dismissNotification = async (notification: Notification) => {
    try {
      // Get current user
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

  if (loading) return null;
  if (notifications.length === 0) return null;

  return (
    <div className="space-y-4 mb-6">
      {notifications.map((notification) => (
        <Alert key={notification.id} className="relative bg-white border-l-4 border-l-primary">
          <AlertCircle className="h-4 w-4 text-primary" />
          <AlertDescription className="pr-8">{notification.message}</AlertDescription>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 hover:bg-gray-100"
            onClick={() => dismissNotification(notification)}
          >
            <X className="h-4 w-4" />
          </Button>
        </Alert>
      ))}
    </div>
  );
};