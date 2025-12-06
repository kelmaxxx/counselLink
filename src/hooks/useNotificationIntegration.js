import { useEffect } from "react";
import { useNotifications } from "../context/NotificationsContext";
import { setNotificationCallback } from "../context/AppointmentsContext";
import { setTestNotificationCallback } from "../context/TestsContext";

export function useNotificationIntegration() {
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Set the callback for both contexts
    setNotificationCallback(addNotification);
    setTestNotificationCallback(addNotification);
  }, [addNotification]);
}
