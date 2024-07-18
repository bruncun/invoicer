import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";
import { Refine } from "@refinedev/core";
import routerProvider from "@refinedev/remix-router";
import { dataProvider } from "@refinedev/supabase";
import styles from "~/index.css";
import { ToastContainer } from "react-toastify";
import DocumentTitleHandler from "./components/document-title-handler";
import { FilterPaginationProvider } from "./contexts/invoices/filter-pagination";
import {
  authProvider,
  notificationProvider,
  resources,
  options,
  None,
} from "./utility/refine";
import { supabaseClient } from "./utility/supabase";

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
        <Refine
          routerProvider={routerProvider}
          dataProvider={dataProvider(supabaseClient)}
          authProvider={authProvider}
          notificationProvider={notificationProvider}
          resources={resources}
          options={options}
        >
          <FilterPaginationProvider>
            <Outlet />
            <ToastContainer
              transition={None}
              autoClose={5000}
              hideProgressBar
            />
            <DocumentTitleHandler />
          </FilterPaginationProvider>
        </Refine>
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
