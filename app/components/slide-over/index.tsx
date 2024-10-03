import { Modal } from "react-bootstrap";
import { ReactNode } from "react";

type SlideOverProps = {
  title: ReactNode;
  body: ReactNode;
  footer: ReactNode;
  visible: boolean;
  close: () => void;
};

const SlideOver = ({ title, body, footer, visible, close }: SlideOverProps) => (
  <Modal
    size="lg"
    show={visible}
    fullscreen="md-down"
    onHide={close}
    className="z-3 z-md-2"
    backdropClassName="z-2"
    dialogClassName="ms-sm-0 mt-0 mb-0 min-vh-lg-100 slide-over-modal-dialog"
    contentClassName="rounded-start-0 ps-xl-navbar"
    scrollable
  >
    <Modal.Header className="px-4">
      <Modal.Title className="fs-5 fs-sm-4">{title}</Modal.Title>
    </Modal.Header>
    <Modal.Body className="p-4">{body}</Modal.Body>
    <Modal.Footer className="px-4">{footer}</Modal.Footer>
  </Modal>
);

export default SlideOver;
