import { useEffect, useState } from "react";
import { ToastContainer as BootstrapToastContainer } from "react-bootstrap";
import { ToastMessage } from "./toast-message";
import {
  getNotifications,
  removeNotification,
  subscribeToNotifications,
} from "~/utility/refine/notification-provider";

export default function ToastContainer() {
  const [, setRenderVersion] = useState(0);

  useEffect(
    () =>
      subscribeToNotifications(() =>
        setRenderVersion((version) => version + 1)
      ),
    []
  );

  return (
    <BootstrapToastContainer className="invoicer-toast-container">
      {getNotifications().map((notification) => (
        <ToastMessage
          key={notification.id}
          description={notification.description}
          type={notification.type}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </BootstrapToastContainer>
  );
}
