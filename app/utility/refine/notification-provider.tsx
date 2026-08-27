import type { NotificationProvider } from "@refinedev/core";

export type ToastNotification = {
  id: string;
  notificationKey?: string;
  description: string;
  type: "success" | "error";
};

const notifications = new Map<string, ToastNotification>();
const subscribers = new Set<() => void>();
let notificationSequence = 0;

const notifySubscribers = () => {
  subscribers.forEach((subscriber) => subscriber());
};

export const subscribeToNotifications = (subscriber: () => void) => {
  subscribers.add(subscriber);

  return () => {
    subscribers.delete(subscriber);
  };
};

export const hasNotifications = () => notifications.size > 0;

export const getNotifications = () => Array.from(notifications.values());

export const removeNotification = (id: string) => {
  if (notifications.delete(id)) notifySubscribers();
};

const closeNotifications = (key: string) => {
  let didRemoveNotification = false;

  notifications.forEach((notification, id) => {
    if (notification.id === key || notification.notificationKey === key) {
      notifications.delete(id);
      didRemoveNotification = true;
    }
  });

  if (didRemoveNotification) notifySubscribers();
};

export const notificationProvider: NotificationProvider = {
  open: (params) => {
    if (params.type === "progress") return;

    const sequence = notificationSequence++;
    const id = `notification_${Date.now()}_${sequence}`;

    notifications.set(id, {
      id,
      notificationKey: params.key,
      description: params.description ?? "",
      type: params.type,
    });
    notifySubscribers();
  },
  close: closeNotifications,
};
