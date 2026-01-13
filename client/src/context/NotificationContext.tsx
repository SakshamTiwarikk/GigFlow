import React, { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
import { Notification, NotificationState } from '@/types';
import { useAuth } from './AuthContext';

interface NotificationContextType extends NotificationState {
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'> & { userId: string }) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
};

type NotificationAction =
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_READ'; payload: string }
  | { type: 'MARK_ALL_READ' }
  | { type: 'CLEAR' };

const NOTIFICATIONS_KEY = 'gigflow_notifications';

function notificationReducer(state: NotificationState, action: NotificationAction): NotificationState {
  switch (action.type) {
    case 'SET_NOTIFICATIONS':
      return {
        notifications: action.payload,
        unreadCount: action.payload.filter((n) => !n.read).length,
      };
    case 'ADD_NOTIFICATION':
      return {
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    case 'MARK_READ':
      return {
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };
    case 'MARK_ALL_READ':
      return {
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      };
    case 'CLEAR':
      return initialState;
    default:
      return state;
  }
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const { user } = useAuth();

  const loadNotifications = useCallback(() => {
    if (!user) return;
    const stored = localStorage.getItem(NOTIFICATIONS_KEY);
    const allNotifications: Array<Notification & { userId: string }> = stored ? JSON.parse(stored) : [];
    const userNotifications = allNotifications
      .filter((n) => n.userId === user.id)
      .map(({ userId, ...rest }) => rest);
    dispatch({ type: 'SET_NOTIFICATIONS', payload: userNotifications });
  }, [user]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // BONUS 2: Poll for new notifications (simulating real-time with Socket.io behavior)
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(() => {
      loadNotifications();
    }, 2000); // Check every 2 seconds for new notifications

    return () => clearInterval(interval);
  }, [user, loadNotifications]);

  const getAllNotifications = (): Array<Notification & { userId: string }> => {
    const stored = localStorage.getItem(NOTIFICATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  };

  const saveNotifications = (notifications: Array<Notification & { userId: string }>) => {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'read' | 'createdAt'> & { userId: string }) => {
    const newNotification = {
      ...notification,
      id: `notif_${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString(),
    };

    const allNotifications = getAllNotifications();
    saveNotifications([newNotification, ...allNotifications]);
    
    // Only dispatch if this notification is for the current user
    if (user && notification.userId === user.id) {
      const { userId, ...rest } = newNotification;
      dispatch({ type: 'ADD_NOTIFICATION', payload: rest });
    }
  };

  const markAsRead = (id: string) => {
    if (!user) return;
    
    const allNotifications = getAllNotifications();
    const updated = allNotifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    saveNotifications(updated);
    dispatch({ type: 'MARK_READ', payload: id });
  };

  const markAllAsRead = () => {
    if (!user) return;
    
    const allNotifications = getAllNotifications();
    const updated = allNotifications.map((n) =>
      n.userId === user.id ? { ...n, read: true } : n
    );
    saveNotifications(updated);
    dispatch({ type: 'MARK_ALL_READ' });
  };

  const clearNotifications = () => {
    if (!user) return;
    
    const allNotifications = getAllNotifications();
    const filtered = allNotifications.filter((n) => n.userId !== user.id);
    saveNotifications(filtered);
    dispatch({ type: 'CLEAR' });
  };

  return (
    <NotificationContext.Provider
      value={{
        ...state,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
