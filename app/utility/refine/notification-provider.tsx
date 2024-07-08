import { NotificationProvider } from "@refinedev/core";
import { Id, ToastOptions, cssTransition, toast } from "react-toastify";
import { ToastMessage, ToastProps } from "~/components/toast-message";

export const None = cssTransition({
  enter: "none",
  exit: "d-none",
  collapse: false,
  collapseDuration: 0,
});

const toaster = (myProps: ToastProps, toastProps: ToastOptions): Id => {
  return toast(<ToastMessage {...myProps} type={toastProps.type} />, {
    ...toastProps,
  });
};

export const notificationProvider: NotificationProvider = {
  open: (params) => {
    const { key, description, type } = params;
    if (type !== "progress") {
      const toastId = `${key}_${Date.now()}`;

      toaster(
        { description: description ?? "" },
        {
          toastId,
          type,
        }
      );
    }
  },
  close: (key) => toast.dismiss(key),
};
