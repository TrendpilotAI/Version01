import { useState, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { MAX_ITEMS } from '../constants';
import type { Notification } from '../types';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const newNotification = {
      id: Date.now(),
      ...notification
    };

    setNotifications(prev => [
      newNotification,
      ...prev
    ].slice(0, MAX_ITEMS.NOTIFICATIONS));

    toast({
      title: notification.title,
      description: notification.message,
      variant: notification.severity === 'critical' ? 'destructive' : 'default'
    });
  }, []);

  return {
    notifications,
    addNotification
  };
}