import React, { createContext, useContext } from 'react';
import { notification, type NotificationArgsProps } from 'antd';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

interface NotificationContextType {
  showNotification: (
    type: NotificationType,
    message: string,
    description?: string,
    config?: NotificationArgsProps
  ) => void;
  showSuccess: (message: string, description?: string) => void;
  showError: (message: string, description?: string) => void;
  showWarning: (message: string, description?: string) => void;
  showInfo: (message: string, description?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [api, contextHolder] = notification.useNotification();

  const showNotification = (
    type: NotificationType,
    message: string,
    description?: string,
    config?: NotificationArgsProps
  ) => {
    api[type]({
      message,
      description,
      placement: 'topRight',
      duration: type === 'error' ? 0 : 4.5, // Keep error notifications until dismissed
      ...config,
    });
  };

  const showSuccess = (message: string, description?: string) => {
    showNotification('success', message, description);
  };

  const showError = (message: string, description?: string) => {
    showNotification('error', message, description);
  };

  const showWarning = (message: string, description?: string) => {
    showNotification('warning', message, description);
  };

  const showInfo = (message: string, description?: string) => {
    showNotification('info', message, description);
  };

  const value: NotificationContextType = {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <NotificationContext.Provider value={value}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};
