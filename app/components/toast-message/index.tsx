import { Toast } from "react-bootstrap";

export type ToastProps = {
  description: string;
  type: "success" | "error";
  onClose?: () => void;
};

export const ToastMessage = ({
  description,
  type,
  onClose,
}: ToastProps) => {
  const color = type === "error" ? "danger" : "success";
  return (
    <Toast
      bg={color}
      className="text-sans-serif"
      autohide
      animation={false}
      delay={5000}
      onClose={onClose}
    >
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
