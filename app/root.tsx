import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerProvider, {
  UnsavedChangesNotifier,
} from "@refinedev/remix-router";

import { dataProvider } from "@refinedev/supabase";
import { authProvider } from "~/authProvider";
import styles from "~/styles/index.css";
import { supabaseClient } from "~/utility";

export const meta: MetaFunction = () => [
  {
    title: "Invoicer",
  },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="vh-lg-100">
        <RefineKbarProvider>
          <Refine
            routerProvider={routerProvider}
            dataProvider={dataProvider(supabaseClient)}
            authProvider={authProvider}
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
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              useNewQueryKeys: true,
              projectId: "AGpg3C-5yTuaG-cOKhCy",
            }}
          >
            <>
              <Outlet />
              <UnsavedChangesNotifier />
              <RefineKbar />
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
