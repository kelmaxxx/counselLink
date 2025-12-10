import React, { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";
import { useNotifications } from "./NotificationsContext";

const MessagesContext = createContext();

export function MessagesProvider({ children }) {
  const { currentUser } = useAuth();
  const { addNotification } = useNotifications();
  
  const [messages, setMessages] = useState(() => {
    const s = localStorage.getItem("messages");
    return s ? JSON.parse(s) : [];
  });

  const [conversations, setConversations] = useState(() => {
    const s = localStorage.getItem("conversations");
    return s ? JSON.parse(s) : [];
  });

  // Send a message
  const sendMessage = ({ recipientId, content }) => {
    if (!currentUser || !recipientId || !content.trim()) {
      return { success: false, message: "Invalid message data" };
    }

    const messageId = messages.reduce((m, msg) => Math.max(m, msg.id || 0), 0) + 1;
    const newMessage = {
      id: messageId,
      senderId: currentUser.id,
      recipientId,
      content: content.trim(),
      timestamp: new Date().toISOString(),
      read: false,
    };

    setMessages((prev) => {
      const next = [...prev, newMessage];
      localStorage.setItem("messages", JSON.stringify(next));
      return next;
    });

    // Update or create conversation
    const conversationKey = [currentUser.id, recipientId].sort().join("-");
    setConversations((prev) => {
      const existing = prev.find((c) => c.id === conversationKey);
      let next;
      if (existing) {
        next = prev.map((c) =>
          c.id === conversationKey
            ? { ...c, lastMessage: content.trim(), lastMessageTime: new Date().toISOString() }
            : c
        );
      } else {
        next = [
          ...prev,
          {
            id: conversationKey,
            participants: [currentUser.id, recipientId],
            lastMessage: content.trim(),
            lastMessageTime: new Date().toISOString(),
          },
        ];
      }
      localStorage.setItem("conversations", JSON.stringify(next));
      return next;
    });

    // Send notification to recipient
    addNotification({
      recipientId,
      title: "New Message",
      message: `${currentUser.name} sent you a message`,
      type: "info",
      link: null,
    });

    return { success: true, message: newMessage };
  };

  // Get messages between current user and another user
  const getConversation = (userId) => {
    if (!currentUser || !userId) return [];
    return messages
      .filter(
        (m) =>
          (m.senderId === currentUser.id && m.recipientId === userId) ||
          (m.senderId === userId && m.recipientId === currentUser.id)
      )
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  };

  // Get all conversations for current user
  const getConversationsForCurrentUser = () => {
    if (!currentUser) return [];
    return conversations
      .filter((c) => c.participants.includes(currentUser.id))
      .sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
  };

  // Mark messages as read
  const markAsRead = (userId) => {
    if (!currentUser || !userId) return;
    setMessages((prev) => {
      const next = prev.map((m) =>
        m.senderId === userId && m.recipientId === currentUser.id ? { ...m, read: true } : m
      );
      localStorage.setItem("messages", JSON.stringify(next));
      return next;
    });
  };

  // Get unread count for a specific user
  const getUnreadCount = (userId) => {
    if (!currentUser || !userId) return 0;
    return messages.filter((m) => m.senderId === userId && m.recipientId === currentUser.id && !m.read).length;
  };

  // Get total unread count
  const getTotalUnreadCount = () => {
    if (!currentUser) return 0;
    return messages.filter((m) => m.recipientId === currentUser.id && !m.read).length;
  };

  return (
    <MessagesContext.Provider
      value={{
        messages,
        conversations,
        sendMessage,
        getConversation,
        getConversationsForCurrentUser,
        markAsRead,
        getUnreadCount,
        getTotalUnreadCount,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessages() {
  return useContext(MessagesContext);
}
