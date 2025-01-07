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
      // Get user's dismissed notifications
      const { data: dismissedNotifications } = await supabase
        .from("dismissed_notifications")
        .select("notification_type, client, platform");

      // Get all optimizations for analysis
      const { data: optimizations } = await supabase
        .from("optimizations")
        .select("client, platform, optimization_date");

      if (!optimizations) return;

      const currentDate = new Date();
      const lastMonth = {
        start: startOfMonth(subDays(currentDate, 30)),
        end: endOfMonth(subDays(currentDate, 30)),
      };

      // Group optimizations by client and platform
      const clientOptimizations = optimizations.reduce((acc: { [key: string]: any[] }, curr) => {
        acc[curr.client] = acc[curr.client] || [];
        acc[curr.client].push(curr);
        return acc;
      }, {});

      const platformOptimizations = optimizations.reduce((acc: { [key: string]: any[] }, curr) => {
        acc[curr.platform] = acc[curr.platform] || [];
        acc[curr.platform].push(curr);
        return acc;
      }, {});

      const newNotifications: Notification[] = [];

      // Check for inactive clients (no optimizations in last 7 days)
      Object.entries(clientOptimizations).forEach(([client, opts]) => {
        const lastOptimization = new Date(Math.max(...opts.map(o => new Date(o.optimization_date).getTime())));
        const daysSinceLastOptimization = Math.floor((currentDate.getTime() - lastOptimization.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysSinceLastOptimization > 7) {
          const isDismissed = dismissedNotifications?.some(
            dn => dn.notification_type === "inactive_client" && dn.client === client
          );
          
          if (!isDismissed) {
            newNotifications.push({
              id: `inactive_${client}`,
              type: "inactive_client",
              message: `You haven't logged any optimisations for ${client} in over 7 days.`,
              client,
            });
          }
        }
      });

      // Check for clients with low optimization percentage last month
      const lastMonthOptimizations = optimizations.filter(
        opt => new Date(opt.optimization_date) >= lastMonth.start && 
              new Date(opt.optimization_date) <= lastMonth.end
      );

      const totalLastMonth = lastMonthOptimizations.length;
      
      Object.entries(clientOptimizations).forEach(([client, opts]) => {
        const clientLastMonth = opts.filter(
          opt => new Date(opt.optimization_date) >= lastMonth.start && 
                new Date(opt.optimization_date) <= lastMonth.end
        ).length;

        const percentage = (clientLastMonth / totalLastMonth) * 100;
        
        if (percentage < 10 && totalLastMonth > 0) {
          const isDismissed = dismissedNotifications?.some(
            dn => dn.notification_type === "low_client_activity" && dn.client === client
          );
          
          if (!isDismissed) {
            newNotifications.push({
              id: `low_activity_${client}`,
              type: "low_client_activity",
              message: `${client} might need more attention, it has made up less than 10% of your optimisations logged last month.`,
              client,
            });
          }
        }
      });

      // Check for platforms with low optimization percentage
      const totalOptimizations = optimizations.length;
      Object.entries(platformOptimizations).forEach(([platform, opts]) => {
        const percentage = (opts.length / totalOptimizations) * 100;
        
        if (percentage < 20) {
          const isDismissed = dismissedNotifications?.some(
            dn => dn.notification_type === "low_platform_activity" && dn.platform === platform
          );
          
          if (!isDismissed) {
            newNotifications.push({
              id: `low_platform_${platform}`,
              type: "low_platform_activity",
              message: `${platform} is receiving less than 20% of your total optimisations logged. Consider focusing more on this channel.`,
              platform,
            });
          }
        }
      });

      setNotifications(newNotifications);
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
      const { error } = await supabase
        .from("dismissed_notifications")
        .insert({
          notification_type: notification.type,
          client: notification.client,
          platform: notification.platform,
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
        <Alert key={notification.id} className="relative">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="pr-8">{notification.message}</AlertDescription>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={() => dismissNotification(notification)}
          >
            <X className="h-4 w-4" />
          </Button>
        </Alert>
      ))}
    </div>
  );
};