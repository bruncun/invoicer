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
        <style></style>
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
              useNewQueryKeys: true,
              projectId: "AGpg3C-5yTuaG-cOKhCy",
            }}
          >
            <>
              <Outlet />
              <UnsavedChangesNotifier />
              <ToastContainer
                hideProgressBar
                transition={None}
                autoClose={5000}
              />
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
