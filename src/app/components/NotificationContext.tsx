"use client";

import React, { createContext, useContext, useState } from "react";

type NotificationType = "success" | "error" | "warning" | "info";

interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}

interface NotificationContextType {
  notifications: Notification[];
  showNotification: (message: string, type: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = (message: string, type: NotificationType) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== id)
      );
    }, 3000);
  };

  return (
    <NotificationContext.Provider value={{ notifications, showNotification }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

const NotificationContainer: React.FC = () => {
  const context = useContext(NotificationContext);
  if (!context) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {context.notifications.map((notification) => (
        <div
          key={notification.id}
          className={`px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out
            ${notification.type === "success" && "bg-green-500 text-white"}
            ${notification.type === "error" && "bg-red-500 text-white"}
            ${notification.type === "warning" && "bg-yellow-500 text-white"}
            ${notification.type === "info" && "bg-blue-500 text-white"}
          `}
        >
          {notification.message}
        </div>
      ))}
    </div>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
