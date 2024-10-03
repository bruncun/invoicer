import InvoicesListItem from "./list-item";
import useInvoicesList from "~/hooks/invoices/use-invoices-list";
import { InferType } from "yup";
import { invoiceSchema } from "~/constants";
import { Col, Row } from "react-bootstrap";
import emptyStateIllustration from "~/assets/illustration-empty-state.svg";

export const InvoicesListGroup = () => {
  const { data, isLoading } = useInvoicesList();
  const invoices = data?.data as Array<InferType<typeof invoiceSchema>>;

  if (isLoading)
    return (
      <ul
        data-testid="invoices-list"
        className="list-unstyled my-3 mb-md-2 d-flex flex-column gap-2"
      >
        {new Array(10).fill(null).map((invoice, idx) => (
          <li key={idx}>
            <InvoicesListItem invoice={invoice} />
          </li>
        ))}
      </ul>
    );

  return (
    <>
      {invoices?.length > 0 ? (
        <ul
          data-testid="invoices-list"
          className="list-unstyled my-3 mb-md-2 d-flex flex-column gap-2"
        >
          {invoices.map((invoice) => (
            <li key={invoice.id}>
              <InvoicesListItem invoice={invoice} />
            </li>
          ))}
        </ul>
      ) : (
        <div
          className="d-flex align-items-center justify-content-center flex-grow-1 mt-7 mt-xl-9"
          data-testid="empty-state"
        >
          <Row className="w-100">
            <Col
              xs={{ span: 9 }}
              sm={{ span: 7 }}
              md={{ span: 5 }}
              lg={{ span: 4 }}
              xl={{ span: 5 }}
              className="text-center mx-auto"
            >
              <img
                src={emptyStateIllustration}
                alt="An illustration of a person standing in a envelope. They are holding a speakerphone and are surrounded by floating envelopes and paper airplanes."
                className="img-fluid mb-5"
              ></img>
              <h2 className="fs-5 mb-3">No invoices</h2>
              <p className="text-muted mb-7">
                Start by creating a new invoice.
              </p>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
};
