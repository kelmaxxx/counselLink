import React, { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";

const NotificationsContext = createContext();

export function NotificationsProvider({ children }) {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState(() => {
    const s = localStorage.getItem("notifications");
    return s ? JSON.parse(s) : [];
  });

  const addNotification = ({ recipientId, recipientRole = null, title, message, type = "info", link = null }) => {
    const id = notifications.reduce((m, n) => Math.max(m, n.id || 0), 0) + 1;
    const notif = {
      id,
      recipientId, // null = all users, specific ID = that user
      recipientRole, // null = any role, specific role = that role only
      title,
      message,
      type, // info, success, warning, error
      link,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => {
      const next = [notif, ...prev];
      localStorage.setItem("notifications", JSON.stringify(next));
      return next;
    });
    return notif;
  };

  const markAsRead = (id) => {
    setNotifications(prev => {
      const next = prev.map(n => n.id === id ? { ...n, read: true } : n);
      localStorage.setItem("notifications", JSON.stringify(next));
      return next;
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => {
      const next = prev.map(n => ({ ...n, read: true }));
      localStorage.setItem("notifications", JSON.stringify(next));
      return next;
    });
  };

  const getNotificationsForCurrentUser = () => {
    if (!currentUser) return [];
    return notifications.filter(n => {
      // Check if notification is for this user specifically
      if (n.recipientId !== null && n.recipientId !== currentUser.id) return false;
      
      // Check if notification is role-specific
      if (n.recipientRole !== null && n.recipientRole !== currentUser.role) return false;
      
      // If recipientId is null and recipientRole is null, it's for everyone
      return true;
    });
  };

  const getUnreadCount = () => {
    return getNotificationsForCurrentUser().filter(n => !n.read).length;
  };

  // Broadcast announcement to all users
  const createAnnouncement = ({ title, message, link = null }) => {
    addNotification({
      recipientId: null, // null = all users
      title,
      message,
      type: "info",
      link,
    });
    return { success: true };
  };

  return (
    <NotificationsContext.Provider value={{
      notifications,
      addNotification,
      markAsRead,
      markAllAsRead,
      getNotificationsForCurrentUser,
      getUnreadCount,
      createAnnouncement,
    }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}
