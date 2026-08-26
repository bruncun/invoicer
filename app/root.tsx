import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import * as cookie from "cookie";
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
import { httpDataProvider } from "./utility/refine/http-data-provider";
import { ThemeProvider, type Theme } from "./hooks/use-theme";

export const meta: MetaFunction = () => [
  {
    title: "Invoicer",
    icon: "",
  },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const theme = cookie.parse(request.headers.get("Cookie") ?? "").theme;
  return json({
    theme: theme === "dark" || theme === "light" ? theme : undefined,
  });
}

export default function App() {
  const env = useLoaderData<typeof loader>();

  return (
    <html lang="en" data-bs-theme={env.theme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeProvider initialTheme={env.theme as Theme | undefined}>
        <Refine
          routerProvider={routerProvider}
          dataProvider={httpDataProvider}
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
        </ThemeProvider>
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
