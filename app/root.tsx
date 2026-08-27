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
import styles from "~/index.css";
import DocumentTitleHandler from "./components/document-title-handler";
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

// This covers the first visible shell while the full, cached stylesheet loads.
// Keep this small. Component-specific styling belongs in the full stylesheet.
const criticalStyles = `
@font-face{font-family:"League Spartan";src:url("/fonts/LeagueSpartan-Variable.woff2") format("woff2");font-weight:100 900;font-style:normal;font-display:optional}html{background:#fff}html[data-bs-theme=dark]{background:#020617}body{margin:0;font-family:"League Spartan",sans-serif;font-size:1rem;line-height:1.5;color:#475569;background:#fff;-webkit-text-size-adjust:100%}[data-bs-theme=dark] body{color:#cbd5e1;background:#020617}*,*::before,*::after{box-sizing:border-box}.layout{min-height:100vh;padding-top:3.75rem;background:#f1f5f9}.container{width:100%;padding-right:1rem;padding-left:1rem;margin-right:auto;margin-left:auto}.row{display:flex;flex-wrap:wrap;margin-right:-.75rem;margin-left:-.75rem}.row>*{width:100%;padding-right:.75rem;padding-left:.75rem}.mx-auto{margin-right:auto!important;margin-left:auto!important}.w-100{width:100%!important}.py-3{padding-top:1rem!important;padding-bottom:1rem!important}.d-none{display:none!important}.d-flex{display:flex!important}.position-relative{position:relative!important}.position-fixed,.fixed-top{position:fixed!important}.fixed-top{top:0;right:0;left:0;z-index:1030}.fixed-bottom{position:fixed;right:0;bottom:0;left:0;z-index:1030}.start-0{left:0!important}.top-0{top:0!important}.vh-100{height:100vh!important}.bg-dark{background:#0f172a!important}.bg-primary{background:#674dcf!important}.text-white{color:#fff!important}.text-center{text-align:center!important}.card{position:relative;display:flex;flex-direction:column;min-width:0;background:#fff;background-clip:border-box;border-radius:.5rem}.card-body{flex:1 1 auto;padding:1rem}.placeholder{display:inline-block;min-height:1em;vertical-align:middle;cursor:wait;background:#e2e8f0;opacity:1}.placeholder-glow .placeholder{animation:placeholder-glow 2s ease-in-out infinite}@keyframes placeholder-glow{50%{opacity:.5}}@media(min-width:992px){.layout{padding-top:0;padding-left:4.125rem}.container{max-width:960px;padding-right:1rem;padding-left:1rem}.d-lg-none{display:none!important}.d-lg-flex{display:flex!important}.py-lg-4{padding-top:1.5rem!important;padding-bottom:1.5rem!important}.col-lg-9{flex:0 0 auto;width:75%}}@media(min-width:1200px){.container{max-width:1140px}.d-xl-flex{display:flex!important}.d-xl-none{display:none!important}.d-xl-inline-block{display:inline-block!important}.py-xl-2{padding-top:.5rem!important;padding-bottom:.5rem!important}.px-xl-4{padding-right:1.5rem!important;padding-left:1.5rem!important}}`;

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
        <style dangerouslySetInnerHTML={{ __html: criticalStyles }} />
        <Links />
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => { const link = document.querySelector('link[data-deferred-styles]'); if (link) link.addEventListener('load', () => { link.media = 'all'; }, { once: true }); })();`,
          }}
        />
        <noscript>
          <link rel="stylesheet" href={styles} />
        </noscript>
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

export function ErrorBoundary() {
  const error = useRouteError();
  const status = isRouteErrorResponse(error) ? error.status : 500;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <style dangerouslySetInnerHTML={{ __html: criticalStyles }} />
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

export function links() {
  return [
    {
      rel: "preload",
      href: "/fonts/LeagueSpartan-Variable.woff2",
      as: "font",
      type: "font/woff2",
      crossOrigin: "anonymous",
    },
    { rel: "stylesheet", href: styles, media: "print", "data-deferred-styles": true },
  ];
}
