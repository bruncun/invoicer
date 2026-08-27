import { Modal } from "react-bootstrap";
import { ReactNode, useEffect, useRef, useState } from "react";

const EXIT_TRANSITION_DURATION = 200;

type SlideOverProps = {
  title: ReactNode;
  body: ReactNode;
  footer: (close: () => void) => ReactNode;
  visible: boolean;
  close: () => void;
};

const SlideOver = ({ title, body, footer, visible, close }: SlideOverProps) => {
  const [isClosing, setIsClosing] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (visible) setIsClosing(false);
  }, [visible]);

  useEffect(
    () => () => {
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
    },
    []
  );

  const requestClose = () => {
    if (isClosing) return;

    setIsClosing(true);
    closeTimeout.current = setTimeout(() => {
      close();
    }, EXIT_TRANSITION_DURATION);
  };

  return (
    <Modal
      size="lg"
      show={visible}
      fullscreen="md-down"
      onHide={requestClose}
      className={`z-3 z-md-2${isClosing ? " slide-over-modal-closing" : ""}`}
      backdropClassName="z-2"
      dialogClassName="ms-sm-0 mt-0 mb-0 min-vh-lg-100 slide-over-modal-dialog"
      contentClassName="rounded-start-0 slide-over-modal-content"
      scrollable
    >
      <Modal.Header className="px-3 px-md-4">
        <Modal.Title className="fs-5 fs-sm-4">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-3 p-md-4">{body}</Modal.Body>
      <Modal.Footer className="px-3 px-md-4 py-2 py-md-3">
        {footer(requestClose)}
      </Modal.Footer>
    </Modal>
  );
};

export default SlideOver;
