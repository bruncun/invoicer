import { useEffect, useState } from "react";
import { NotificationProvider } from "@refinedev/core";
import { ToastContainer as BootstrapToastContainer } from "react-bootstrap";
import { ToastMessage, ToastProps } from "~/components/toast-message";

type ToastNotification = ToastProps & {
  id: string;
  notificationKey?: string;
};

const notifications = new Map<string, ToastNotification>();
const subscribers = new Set<() => void>();
let notificationSequence = 0;

const notifySubscribers = () => {
  subscribers.forEach((subscriber) => subscriber());
};

const removeNotification = (id: string) => {
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

export const ToastContainer = () => {
  const [, setRenderVersion] = useState(0);

  useEffect(() => {
    const subscriber = () => setRenderVersion((version) => version + 1);
    subscribers.add(subscriber);

    return () => {
      subscribers.delete(subscriber);
    };
  }, []);

  return (
    <BootstrapToastContainer
      position="top-end"
      containerPosition="fixed"
      className="invoicer-toast-container px-3 py-4"
    >
      {Array.from(notifications.values()).map((notification) => (
        <ToastMessage
          key={notification.id}
          description={notification.description}
          type={notification.type}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </BootstrapToastContainer>
  );
};
