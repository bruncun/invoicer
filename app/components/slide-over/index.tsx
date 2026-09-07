import { Modal } from "react-bootstrap";
import { ReactNode, useEffect, useState } from "react";

type SlideOverProps = {
  title: ReactNode;
  body: ReactNode;
  footer: (close: () => void) => ReactNode;
  visible: boolean;
  close: () => void;
};

const SlideOver = ({ title, body, footer, visible, close }: SlideOverProps) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (visible) setIsClosing(false);
  }, [visible]);

  const requestClose = () => {
    if (isClosing) return;

    setIsClosing(true);
  };

  return (
    <Modal
      size="lg"
      show={visible && !isClosing}
      fullscreen="md-down"
      onHide={requestClose}
      onExited={close}
      className={`z-3 z-md-2${isClosing ? " slide-over-modal-closing" : ""}`}
      backdropClassName="z-2"
      dialogClassName="ms-md-0 mt-0 mb-0 min-vh-xl-100 slide-over-modal-dialog"
      contentClassName="rounded-start-0 slide-over-modal-content"
      scrollable
    >
      <Modal.Header className="px-3 px-md-4">
        <Modal.Title className="fs-5 fs-md-4">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-3 p-md-4">{body}</Modal.Body>
      <Modal.Footer className="px-3 px-md-4 py-2 py-md-3">
        {footer(requestClose)}
      </Modal.Footer>
    </Modal>
  );
};

export default SlideOver;
