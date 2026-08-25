import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
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

export async function loader({}: LoaderFunctionArgs) {
  return json({
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_KEY: process.env.SUPABASE_KEY,
  });
}

export default function App() {
  const env = useLoaderData<typeof loader>();

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
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(env)}`,
          }}
        />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}
