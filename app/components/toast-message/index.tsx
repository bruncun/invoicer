import { ToastOptions } from "react-toastify";
import { Toast } from "react-bootstrap";

export type ToastProps = {
  description: string;
};

export const ToastMessage = ({
  description,
  type,
}: ToastProps & ToastOptions) => {
  const color = type === "error" ? "danger" : "success";
  return (
    <Toast bg={color} className="text-sans-serif w-100">
      <Toast.Header
        closeButton={false}
        className={`justify-content-between d-flex text-${color}-emphasis fw-medium rounded-top`}
      >
        {type && type.charAt(0).toUpperCase() + type.slice(1)}
      </Toast.Header>
      <Toast.Body>{description}</Toast.Body>
    </Toast>
  );
};
