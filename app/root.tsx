import type { ErrorResponse, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";

import { Refine } from "@refinedev/core";
import { RefineKbarProvider } from "@refinedev/kbar";
import routerProvider, {
  UnsavedChangesNotifier,
} from "@refinedev/remix-router";

import { dataProvider } from "@refinedev/supabase";
import styles from "~/styles/index.css";
import { supabaseClient } from "~/utility";

import { ToastContainer } from "react-toastify";
import { None, notificationProvider } from "./providers/notification-provider";
import { authProvider } from "./authProvider";
import useTheme from "./hooks/use-theme";
import { Row, Col, Button } from "react-bootstrap";
import Icon from "./components/icon";

export const meta: MetaFunction = () => [
  {
    title: "Invoicer",
    icon: "",
  },
];

export default function App() {
  const error = useRouteError();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <RefineKbarProvider>
          <Refine
            routerProvider={routerProvider}
            dataProvider={dataProvider(supabaseClient)}
            authProvider={authProvider}
            notificationProvider={notificationProvider}
            resources={[
              {
                name: "invoices",
                list: "/invoices",
                create: "/invoices/create",
                edit: "/invoices/edit/:id",
                show: "/invoices/show/:id",
                meta: {
                  canDelete: true,
                },
              },
            ]}
            options={{
              warnWhenUnsavedChanges: true,
              useNewQueryKeys: true,
              projectId: "AGpg3C-5yTuaG-cOKhCy",
            }}
          >
            <>
              <Outlet />
              <UnsavedChangesNotifier />
              <ToastContainer hideProgressBar transition={None} />
            </>
          </Refine>
        </RefineKbarProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export function ErrorBoundary() {
  const error = useRouteError() as ErrorResponse;
  useTheme();
  console.log(error);
  return (
    <html>
      <head>
        <title>Oops!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div
          className="position-absolute top-50 start-50 translate-middle w-100"
          data-testid="loading"
        >
          <Row>
            <Col xs={{ span: 6, offset: 3 }} className="text-center">
              <div>
                <span className="h6 mb-3 text-primary d-block">
                  {error.status}
                </span>
                <span className="h4 mb-5 d-block">{error.statusText}</span>
                <Button
                  onClick={() => {
                    window.history.back();
                  }}
                >
                  <Icon name="chevron-left" className="me-2"></Icon>
                  Go back
                </Button>
              </div>
            </Col>
          </Row>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
