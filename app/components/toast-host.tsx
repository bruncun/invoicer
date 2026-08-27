import { lazy, Suspense, useEffect, useState, useSyncExternalStore } from "react";
import {
  hasNotifications,
  subscribeToNotifications,
} from "~/utility/refine/notification-provider";

const LazyToastContainer = lazy(() => import("./toast-container"));
const toastStylesheetSelector = 'link[data-invoicer-toast-styles="true"]';

export default function ToastHost() {
  const hasActiveNotifications = useSyncExternalStore(
    subscribeToNotifications,
    hasNotifications,
    () => false
  );
  const [stylesLoaded, setStylesLoaded] = useState(false);

  useEffect(() => {
    if (!hasActiveNotifications) return;

    const existingStylesheet = document.querySelector<HTMLLinkElement>(
      toastStylesheetSelector
    );
    if (existingStylesheet) {
      setStylesLoaded(true);
      return;
    }

    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = "/toast.css";
    stylesheet.dataset.invoicerToastStyles = "true";
    stylesheet.onload = () => setStylesLoaded(true);
    stylesheet.onerror = () => setStylesLoaded(true);
    document.head.appendChild(stylesheet);
  }, [hasActiveNotifications]);

  if (!hasActiveNotifications || !stylesLoaded) return null;

  return (
    <Suspense fallback={null}>
      <LazyToastContainer />
    </Suspense>
  );
}
