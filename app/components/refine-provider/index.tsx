import { Refine } from "@refinedev/core";
import routerProvider from "@refinedev/remix-router";
import type { PropsWithChildren } from "react";
import ToastHost from "~/components/toast-host";
import {
  authProvider,
  notificationProvider,
  options,
  resources,
} from "~/utility/refine";
import { httpDataProvider } from "~/utility/refine/http-data-provider";

/**
 * Keep Refine at the interactive route boundary. The shell can render before
 * the browser loads this chunk.
 */
export default function RefineProvider({ children }: PropsWithChildren) {
  return (
    <Refine
      routerProvider={routerProvider}
      dataProvider={httpDataProvider}
      authProvider={authProvider}
      notificationProvider={notificationProvider}
      resources={resources}
      options={options}
    >
      {children}
      <ToastHost />
    </Refine>
  );
}
