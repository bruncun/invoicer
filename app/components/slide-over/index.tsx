import {
  Button,
  Col,
  Form,
  Modal,
  OverlayTrigger,
  Row,
  Stack,
  Tooltip,
} from "react-bootstrap";
import { Icon } from "../icon";

export const SlideOver = () => (
  <Modal
    show={true}
    fullscreen="sm-down"
    onHide={() => {}}
    className="slide-over-modal z-2"
    dialogClassName="mt-0 ms-lg-6 ps-lg-2 mb-0 min-vh-100"
    contentClassName="rounded-start-0"
    scrollable
  >
    <Modal.Header className="px-4">
      <Modal.Title className="lh-1 border-top border-transparent">
        New Invoice
      </Modal.Title>
    </Modal.Header>
    <Modal.Body className="p-4">
      <h6 className="text-primary mb-2">Bill From</h6>
      <Stack gap={3} className="mb-4">
        <Form.Group>
          <Form.Label>Street Address</Form.Label>
          <Form.Control autoComplete="address" />
        </Form.Group>
        <Row className="gx-3">
          <Col>
            <Form.Group>
              <Form.Label>City</Form.Label>
              <Form.Control autoComplete="address-level2" />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Post Code</Form.Label>
              <Form.Control type="tel" autoComplete="postal-code" />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Country</Form.Label>
              <Form.Control autoComplete="country" />
            </Form.Group>
          </Col>
        </Row>
      </Stack>
      <h6 className="text-primary mb-2">Bill To</h6>
      <Stack gap={3} className="mb-5">
        <Form.Group>
          <Form.Label>Client's Name</Form.Label>
          <Form.Control name="search-client-name" />
        </Form.Group>
        <Form.Group>
          <Form.Label>Client's Email</Form.Label>
          <Form.Control name="search-client-email" />
        </Form.Group>
        <Form.Group>
          <Form.Label>Street Address</Form.Label>
          <Form.Control name="search-client-street-address" />
        </Form.Group>
        <Row className="gx-3">
          <Col>
            <Form.Group>
              <Form.Label>City</Form.Label>
              <Form.Control name="search-client-city" />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Post Code</Form.Label>
              <Form.Control type="tel" name="search-client-post-code" />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Country</Form.Label>
              <Form.Control name="search-client-country" />
            </Form.Group>
          </Col>
        </Row>
        <Row className="gx-3">
          <Col>
            <Form.Group>
              <Form.Label>Invoice Date</Form.Label>
              <Form.Control type="date" />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Payment Terms</Form.Label>
              <Form.Select>
                <option>Net 30</option>
                <option>Net 60</option>
                <option>Net 90</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Form.Group>
          <Form.Label>Project Description</Form.Label>
          <Form.Control />
        </Form.Group>
      </Stack>
      <h5 className="text-muted mb-3">Item List</h5>
      <Stack gap={3} className="mb-4">
        <Form.Group>
          <Form.Label>Item Name</Form.Label>
          <Form.Control name="search-item-name" />
        </Form.Group>
        <Row className="gx-3">
          <Col xs={{ span: 3 }}>
            <Form.Group>
              <Form.Label>Qty.</Form.Label>
              <Form.Control type="number" />
            </Form.Group>
          </Col>
          <Col xs={{ span: 4 }}>
            <Form.Group>
              <Form.Label>Price</Form.Label>
              <Form.Control />
            </Form.Group>
          </Col>
          <Col xs={{ span: 4 }}>
            <Form.Group>
              <Form.Label>Total</Form.Label>
              <span className="mt-2 border border-transparent d-block lh-1">
                $400.00
              </span>
            </Form.Group>
          </Col>
          <Col xs={{ span: 1 }} className="pt-2 justify-content-end d-flex">
            <OverlayTrigger
              overlay={<Tooltip id="delete-tooltip">Delete Item</Tooltip>}
            >
              <Button variant="link" className="mt-4 border-0">
                <Icon name="trash"></Icon>
                <span className="visually-hidden">Delete</span>
              </Button>
            </OverlayTrigger>
          </Col>
        </Row>
      </Stack>
      <Button variant="secondary" className="w-100">
        <Icon name="plus-lg" className="me-2"></Icon>Add New Item
      </Button>
    </Modal.Body>
    <Modal.Footer className="px-4 py-3">
      <Stack direction="horizontal" gap={2} className="m-0">
        <Button variant="link">Cancel</Button>
        <Button variant="dark">Save as Draft</Button>
        <Button variant="primary">Save & Send</Button>
      </Stack>
    </Modal.Footer>
  </Modal>
);
