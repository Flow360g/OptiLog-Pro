import { useNotifications } from "@/hooks/useNotifications";
import { NotificationItem } from "./notifications/NotificationItem";

export const InsightNotifications = () => {
  const { notifications, loading, dismissNotification } = useNotifications();

  if (loading) return null;
  if (notifications.length === 0) return null;

  return (
    <div className="space-y-4 mb-6">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          id={notification.id}
          message={notification.message}
          onDismiss={() => dismissNotification(notification)}
        />
      ))}
    </div>
  );
};