export const InvoiceList = () => {
  return (
    <>
      <div className="py-3 py-xl-4 container">
        <div className="card">
          <div className="p-md-5 card-body">
            <div className="d-md-flex justify-content-between mb-3">
              <div>
                <span className="fw-medium text-muted d-flex align-items-center lh-1 fs-5">
                  #<span className="text-body-emphasis">10002</span>
                </span>
                <div className="clearfix mb-1"></div>
                <p>5</p>
              </div>
              <address className="text-md-end mb-4">
                <span>1480 NW North River Dr, Apt 1413</span>
                <br />
                <span>Miami</span>
                <br />
                <span>33125</span>
                <br />
                <span>United States</span>
              </address>
            </div>
            <dl className="mb-5">
              <div className="row">
                <div className="col-md-4 col-6 mb-4">
                  <dt>Invoice Date</dt>
                  <dd className="mb-4 text-body-emphasis fw-medium">
                    Jun 27 2024
                  </dd>
                  <dt>Payment Due</dt>
                  <dd className="text-body-emphasis fw-medium">Jun 27 2024</dd>
                </div>
                <div className="col-md-4 col-6">
                  <dt>Bill To</dt>
                  <dd>
                    <span className="text-body-emphasis fw-medium">
                      Bruno Cunha
                    </span>
                    <br />
                    <address>
                      <span>1480 NW North River Dr, Apt 1413</span>
                      <br />
                      <span>Miami</span>
                      <br />
                      <span>33125</span>
                      <br />
                      <span>United States</span>
                    </address>
                  </dd>
                </div>
                <div className="col">
                  <div className="row">
                    <div className="col-6 col-md-12">
                      <dt>Sent To</dt>
                      <dd
                        className="mb-4 text-body-emphasis fw-medium text-truncate"
                        title="bruncun@icloud.com"
                      >
                        bruncun@icloud.com
                      </dd>
                    </div>
                    <div className="col-6 col-md-12">
                      <dd>
                        <dt>Status</dt>
                        <span className="text-warning-emphasis fs-6 text-capitalize d-flex align-items-center justify-content-center w-8 badge bg-warning-subtle">
                          <span className="me-2 d-inline-block">•</span>
                          pending
                        </span>
                      </dd>
                    </div>
                  </div>
                </div>
              </div>
            </dl>
            <div className="rounded-bottom-0 card bg-body-secondary">
              <div className="card-body">
                <table
                  style={{ tableLayout: "fixed" }}
                  className="d-none d-md-table text-body-tertiary table"
                >
                  <thead>
                    <tr>
                      <th>Item Name</th>
                      <th className="text-center">QTY.</th>
                      <th className="text-end">Price</th>
                      <th className="text-end">Total</th>
                    </tr>
                  </thead>
                  <tbody className="fw-medium">
                    <tr>
                      <td className="align-top text-body-emphasis fw-medium">
                        Bruno Cunha
                      </td>
                      <td className="text-center">1</td>
                      <td className="align-top text-end">$0.00</td>
                      <td className="align-top text-body-emphasis fw-medium text-end">
                        $0.00
                      </td>
                    </tr>
                    <tr>
                      <td className="align-top text-body-emphasis fw-medium">
                        Bruno Cunha
                      </td>
                      <td className="text-center">1</td>
                      <td className="align-top text-end">$0.00</td>
                      <td className="align-top text-body-emphasis fw-medium text-end">
                        $0.00
                      </td>
                    </tr>
                    <tr>
                      <td className="align-top text-body-emphasis fw-medium">
                        Bruno Cunha
                      </td>
                      <td className="text-center">1</td>
                      <td className="align-top text-end">$0.00</td>
                      <td className="align-top text-body-emphasis fw-medium text-end">
                        $0.00
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="d-md-none vstack gap-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <span className="fw-medium text-body-emphasis d-block">
                        Bruno Cunha
                      </span>
                      <span>1 x $0.00</span>
                    </div>
                    <span>$0.00</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <span className="fw-medium text-body-emphasis d-block">
                        Bruno Cunha
                      </span>
                      <span>1 x $0.00</span>
                    </div>
                    <span>$0.00</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <span className="fw-medium text-body-emphasis d-block">
                        Bruno Cunha
                      </span>
                      <span>1 x $0.00</span>
                    </div>
                    <span>$0.00</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-top-0 mb-6 mb-md-0 text-white card bg-secondary">
              <div className="px-xl-4 mx-xl-2 card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="mb-0">Amount Due</span>
                  <span className="fw-medium fs-4">$554.54</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceList;
