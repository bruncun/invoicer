import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import * as cookie from "cookie";
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
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
import styles from "./index.css?raw";
import { FilterPaginationProvider } from "./contexts/invoices/filter-pagination";
import {
  authProvider,
  notificationProvider,
  resources,
  options,
} from "./utility/refine";
import { httpDataProvider } from "./utility/refine/http-data-provider";
import { ThemeProvider, type Theme } from "./hooks/use-theme";
import FullScreenError from "./components/full-screen-error";
import ToastHost from "./components/toast-host";

export const meta: MetaFunction = () => [
  {
    title: "Invoicer",
    icon: "",
  },
  {
    name: "description",
    content: "Create, manage, and send professional invoices with Invoicer.",
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
        <link
          rel="preload"
          href="/fonts/LeagueSpartan-Variable.woff2?v=1"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <style dangerouslySetInnerHTML={{ __html: styles }} />
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
            <ToastHost />
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

export function ErrorBoundary() {
  const error = useRouteError();
  const status = isRouteErrorResponse(error) ? error.status : 500;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <link
          rel="preload"
          href="/fonts/LeagueSpartan-Variable.woff2?v=1"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <style dangerouslySetInnerHTML={{ __html: styles }} />
        <Links />
      </head>
      <body>
        <FullScreenError />
        <p className="visually-hidden">Error status: {status}</p>
        <Scripts />
      </body>
    </html>
  );
}
