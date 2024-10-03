import { NotificationProvider } from "@refinedev/core";
import { Toast } from "react-bootstrap";
import { Id, ToastOptions, cssTransition, toast } from "react-toastify";

export const None = cssTransition({
  enter: "none",
  exit: "d-none",
  collapse: false,
  collapseDuration: 0,
});

export const Msg = ({
  description,
  type,
  closeToast,
}: ToastProps & ToastOptions) => {
  const color = type === "error" ? "danger" : "success";
  return (
    <Toast onClose={closeToast} bg={color} className="text-sans-serif">
      <Toast.Header
        className={`justify-content-between d-flex text-${color}-emphasis fw-medium rounded-top`}
      >
        {type && type.charAt(0).toUpperCase() + type.slice(1)}
      </Toast.Header>
      <Toast.Body>{description}</Toast.Body>
    </Toast>
  );
};

type ToastProps = {
  description: string;
  closeToast?: () => void;
};

const toaster = (myProps: ToastProps, toastProps: ToastOptions): Id => {
  return toast(<Msg {...myProps} type={toastProps.type} />, { ...toastProps });
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
