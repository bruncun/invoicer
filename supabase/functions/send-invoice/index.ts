// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { Tables } from "~/types/supabase";
import { format, parseISO } from "https://esm.sh/date-fns@3.6.0";
import { formatCurrency } from "~/utility/formatters";

// Setup type definitions for built-in Supabase Runtime APIs
/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const {
    id,
    sender_street,
    sender_city,
    sender_postcode,
    sender_country,
    client_name,
    client_email,
    client_street,
    client_city,
    client_country,
    client_postcode,
    payment_due,
    payment_terms,
    description,
    items,
  } = await req.json();

  const totalAmountDue = formatCurrency(
    items.reduce(
      (total: number, item: Tables<"items">) =>
        total + item.quantity * item.price,
      0
    )
  );

  const html = `
    <html>
      <head>
        <style>
          ${styles}
        </style>
      </head>
      <body>
        <div class="py-3 py-xl-4 container">
          <div class="card">
            <div class="p-md-5 card-body">
              <div class="d-md-flex justify-content-between mb-3">
                <div>
                  <span class="fw-semibold text-muted d-flex align-items-center lh-1 fs-5">
                    #<span class="text-body-emphasis">${id}</span>
                  </span>
                  <div class="clearfix mb-1"></div>
                  <p>${description}</p>
                </div>
                <address class="text-md-end mb-4">
                  <span>${sender_street}</span>
                  <br />
                  <span>${sender_city}</span>
                  <br />
                  <span>${sender_postcode}</span>
                  <br />
                  <span>${sender_country}</span>
                </address>
              </div>
              <dl class="mb-5">
                <div class="row">
                  <div class="col-md-4 col-6 mb-4">
                    <dt>Invoice Date</dt>
                    <dd class="mb-4 text-body-emphasis fw-semibold">
                      ${format(parseISO(payment_due), "MMM dd yyyy")}
                    </dd>
                    <dt>Payment Due</dt>
                    <dd class="text-body-emphasis fw-semibold">
                      ${format(parseISO(payment_due), "MMM dd yyyy")}
                    </dd>
                  </div>
                  <div class="col-md-4 col-6">
                    <dt>Bill To</dt>
                    <dd>
                      <span class="text-body-emphasis fw-semibold">
                        ${client_name}
                      </span>
                      <br />
                      <address>
                        <span>${client_street}</span>
                        <br />
                        <span>${client_city}</span>
                        <br />
                        <span>${client_postcode}</span>
                        <br />
                        <span>${client_country}</span>
                      </address>
                    </dd>
                  </div>
                  <div class="col">
                    <div class="row">
                      <div class="col-6 col-md-12">
                        <dt>Sent To</dt>
                        <dd
                          class="mb-4 text-body-emphasis fw-semibold text-truncate"
                          title="${client_email}"
                        >
                          ${client_email}
                        </dd>
                      </div>
                      <div class="col-6 col-md-12">
                        <dd>
                          <dt>Status</dt>
                          <span class="text-warning-emphasis fs-6 text-capitalize d-flex align-items-center justify-content-center w-8 badge bg-warning-subtle">
                            <span class="me-2 d-inline-block">•</span>
                            pending
                          </span>
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>
              </dl>
              <div class="rounded-bottom-0 card bg-body-secondary">
                <div class="card-body">
                  <table
                    style="table-layout: 'fixed';"
                    class="d-none d-md-table table"
                  >
                    <thead>
                      <tr>
                        <th>Item Name</th>
                        <th class="text-center">QTY.</th>
                        <th class="text-end">Price</th>
                        <th class="text-end">Total</th>
                      </tr>
                    </thead>
                    <tbody class="fw-semibold">
                      ${items
                        .map(
                          (item: Tables<"items">) => `
                        <tr>
                          <td class="align-top text-body-emphasis fw-semibold">
                            ${item.name}
                          </td>
                          <td class="text-center fw-normal">${
                            item.quantity
                          }</td>
                          <td class="align-top text-end fw-normal">$${formatCurrency(
                            item.price
                          )}</td>
                          <td class="align-top text-body-emphasis fw-semibold text-end">
                          $${formatCurrency(item.quantity * item.price)}
                          </td>
                        </tr>
                      `
                        )
                        .join("")}
                    </tbody>
                  </table>
                  <div class="d-md-none vstack gap-3">
                    ${items
                      .map(
                        (item: Tables<"items">) => `
                        <div class="d-flex justify-content-between align-items-center">
                          <div>
                            <span class="fw-semibold text-body-emphasis d-block">
                              ${item.name}
                            </span>
                            <span>${item.quantity} x $${formatCurrency(
                          item.price
                        )}</span>
                          </div>
                          <span>$${formatCurrency(item.price)}</span>
                        </div>
                      `
                      )
                      .join("")}
                  </div>
                </div>
              </div>
              <div class="rounded-top-0 text-white card bg-secondary">
                <div class="px-xl-4 mx-xl-2 card-body">
                  <div class="d-flex justify-content-between align-items-center">
                    <span class="mb-0">Amount Due</span>
                    <span class="fw-semibold fs-4">$${totalAmountDue}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        Authorization: `Bearer ${"re_Bx4GoZz1_Haeg2DVCjQjXjwTcKDf3xF8j"}`,
      },
      body: JSON.stringify({
        from: "Invoicer <onboarding@resend.dev>",
        to: ["bruncun@icloud.com"],
        subject: `Invoice #${id}`,
        html,
      }),
    });

    return new Response(JSON.stringify(res), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), {
      headers: corsHeaders,
      status: 500,
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/hello-world' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/

const styles = `
@import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap");

* {
  box-sizing: border-box;
}

html {
  font-size: 16px;
}

body {
  font-family: "IBM Plex Sans", sans-serif;
  font-size: 16px;
  line-height: 1.5;
  color: #475569;
  background-color: #f8f9fa;
  margin: 0;
  padding: 0;
}

address {
  font-style: normal;
}

.rounded-bottom-0 {
  border-bottom-right-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}

.bg-body-secondary {
  background-color: #E2E8F0 !important;
}

.d-none {
  display: none !important;
}

.text-center {
  text-align: center !important;
}

.text-end {
  text-align: right !important;
}

.align-top {
  vertical-align: top !important;
}

table {
  caption-side: bottom;
  border-collapse: collapse;
}
th {
  text-align: inherit;
  text-align: -webkit-match-parent;
}

thead,
tbody,
tfoot,
tr,
td,
th {
  border-color: inherit;
  border-style: solid;
  border-width: 0;
  font-size: 1rem;
}

.table {
  width: 100%;
  margin-bottom: 1rem;
  vertical-align: top;
}

th {
  font-weight: normal;
}

.table > :not(caption) > * > * {
  padding: 0.5rem 0.5rem;
  border-bottom-width: 0;
}

.table > tbody {
  vertical-align: inherit;
}
.table > thead {
  vertical-align: bottom;
}

.card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  color: #475569;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border-radius: 0.5rem;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-body {
  flex: 1 1 auto;
  padding: 1.5rem;
}

.container {
  width: 100%;
  padding-right: calc(1.5rem * 0.5);
  padding-left: calc(1.5rem * 0.5);
  max-width: 1018px;
  margin-right: auto;
  margin-left: auto;
}

.py-3 {
  padding-top: 1rem !important;
  padding-bottom: 1rem !important;
}

.justify-content-between {
  justify-content: space-between !important;
}

.fw-normal {
  font-weight: 400 !important;
}

.fw-semibold {
  font-weight: 600 !important;
}

.text-muted {
  color: rgba(71, 85, 105, 0.75) !important;
}

.text-body-emphasis {
  color: #0f172a !important;
}

.d-flex {
  display: flex !important;
}

.align-items-center {
  align-items: center !important;
}

.mb-3 {
  margin-bottom: 1rem !important;
}

.clearfix {
  display: flow-root;
}

.mb-1 {
  margin-bottom: 0.25rem !important;
}

.mb-4 {
  margin-bottom: 1.5rem !important;
}

.lh-1 {
  line-height: 1 !important;
}

.fs-5 {
  font-size: 1.25rem !important;
}

.row {
  display: flex;
  flex-wrap: wrap;
  margin-right: calc(1.5rem * -0.5);
  margin-left: calc(1.5rem * -0.5);
}

.row > * {
  flex-shrink: 0;
  width: 100%;
  max-width: 100%;
  padding-right: calc(1.5rem * 0.5);
  padding-left: calc(1.5rem * 0.5);
}

.col {
  flex: 1 0 0%;
}

.col-6 {
  flex: 0 0 50%;
  max-width: 50%;
}

p {
  margin-top: 0;
  margin-bottom: 1rem;
}

.mb-5 {
  margin-bottom: 3rem !important;
}

dd {
  margin-bottom: 0.5rem;
  margin-left: 0;
}

dl {
  margin-top: 0;
  margin-bottom: 1rem;
}
.text-warning-emphasis {
  color: #663900 !important;
}

.text-capitalize {
  text-transform: capitalize !important;
}

.badge {
  display: inline-block;
  padding: 0.8125em 0.95em;
  font-size: 0.75em;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.25rem;
}

.justify-content-center {
  justify-content: center !important;
}

.w-8 {
  width: 7.5rem !important;
}

.bg-warning-subtle {
  background-color: #ffe9cc !important;
}

.gap-3 {
  gap: 1rem !important;
}

.vstack {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  align-self: stretch;
}

.fs-4 {
  font-size: 1.5rem !important;
}

.bg-secondary {
  background-color: rgb(100, 116, 139) !important;
}

.rounded-top-0 {
  border-top-left-radius: 0 !important;
  border-top-right-radius: 0 !important;
}

.mb-6 {
  margin-bottom: 4rem !important;
}

.text-white {
  color: #fff !important;
}

.d-inline-block {
  display: inline-block !important;
}

.d-block {
  display: block !important;
}

@media (min-width: 768px) {
  .d-md-none {
    display: none !important;
  }

  .p-md-5 {
    padding: 3rem !important;
  }

  .d-md-flex {
    display: flex !important;
  }

  .text-md-end {
    text-align: right !important;
  }

  .d-md-table {
    display: table !important;
  }

  .col-md-4 {
    flex: 0 0 33.333333% !important;
    max-width: 33.333333% !important;
  }
}

.me-2 {
  margin-right: 0.5rem !important;
}

.fs-6 {
  font-size: 1rem !important;
}

@media (min-width: 1200px) {
  .py-xl-4 {
    padding-top: 1.5rem !important;
    padding-bottom: 1.5rem !important;
  }

  .col-xl-12 {
    flex: 0 0 100% !important;
    max-width: 100% !important;
  }
}

@media (min-width: 576px) {
  .container {
    max-width: 540px;
  }
}
@media (min-width: 768px) {
  .container {
    max-width: 720px;
  }

  .col-md-12 {
    flex: 0 0 100% !important;
    max-width: 100% !important;
  }
}
@media (min-width: 992px) {
  .container {
    max-width: 960px;
  }
}
@media (min-width: 1200px) {
  .container {
    max-width: 1140px;
  }
}
@media (min-width: 1400px) {
  .container {
    max-width: 1320px;
  }
}
`;
