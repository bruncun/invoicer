import { ToastOptions } from "react-toastify";
import { Toast } from "react-bootstrap";

export type ToastProps = {
  description: string;
  closeToast?: () => void;
};

export const ToastMessage = ({
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
