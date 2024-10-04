import { NotificationProvider } from "@refinedev/core";
import { Toast } from "react-bootstrap";
import { Id, ToastOptions, cssTransition, toast } from "react-toastify";

export const None = cssTransition({
  enter: "none",
  exit: "d-none",
  collapse: false,
  collapseDuration: 0,
});

export const Msg = ({ message, type, closeToast }: MyProps & ToastOptions) => {
  const color = type === "error" ? "danger" : "success";
  return (
    <Toast onClose={closeToast} bg={color} className="text-sans-serif">
      <Toast.Header
        className={`justify-content-between d-flex text-${color}-emphasis fw-semibold`}
      >
        {type && type.charAt(0).toUpperCase() + type.slice(1)}
      </Toast.Header>
      <Toast.Body>{message}</Toast.Body>
    </Toast>
  );
};

type MyProps = {
  message: string;
  closeToast?: () => void;
};

const toaster = (myProps: MyProps, toastProps: ToastOptions): Id => {
  return toast(<Msg {...myProps} type={toastProps.type} />, { ...toastProps });
};

export const notificationProvider: NotificationProvider = {
  open: ({ key, message, type }) => {
    if (type !== "progress") {
      toaster(
        { message },
        {
          toastId: key,
          type,
        }
      );
    }
  },
  close: (key) => toast.dismiss(key),
};
