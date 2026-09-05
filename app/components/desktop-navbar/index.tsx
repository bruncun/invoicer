import { lazy, Suspense, useCallback, useState } from "react";
import { Link } from "@remix-run/react";
import logoSvg from "~/assets/logo.svg";
import DesktopNavbarActions, { type DesktopNavbarActionsProps } from "./actions";

const tooltipStylesheetSelector =
  'link[data-invoicer-tooltip-styles="true"]';
let tooltipModulePromise: Promise<typeof import("./tooltip-actions")> | undefined;
let tooltipStylesheetPromise: Promise<void> | undefined;

const loadTooltipModule = () => {
  tooltipModulePromise ??= import("./tooltip-actions");
  return tooltipModulePromise;
};

const LazyDesktopNavbarTooltipActions = lazy(loadTooltipModule);

const loadTooltipStylesheet = () => {
  if (tooltipStylesheetPromise) return tooltipStylesheetPromise;

  tooltipStylesheetPromise = new Promise((resolve, reject) => {
    const existingStylesheet = document.querySelector<HTMLLinkElement>(
      tooltipStylesheetSelector
    );
    if (existingStylesheet) {
      resolve();
      return;
    }

    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = "/tooltip.css";
    stylesheet.dataset.invoicerTooltipStyles = "true";
    stylesheet.onload = () => resolve();
    stylesheet.onerror = () =>
      reject(new Error("Could not load tooltip styles"));
    document.head.appendChild(stylesheet);
  });

  return tooltipStylesheetPromise;
};

type DesktopNavbarProps = DesktopNavbarActionsProps & {
  invoicesListUrl: string;
};

const DesktopNavbar = ({
  theme,
  toggleTheme,
  logout,
  isLoading,
  invoicesListUrl,
}: DesktopNavbarProps) => {
  const [tooltipsReady, setTooltipsReady] = useState(false);
  const prefetchTooltips = useCallback(() => {
    if (
      tooltipsReady ||
      typeof window === "undefined" ||
      !window.matchMedia("(min-width: 992px)").matches
    ) {
      return;
    }

    void Promise.all([loadTooltipModule(), loadTooltipStylesheet()])
      .then(() => setTooltipsReady(true))
      .catch(() => undefined);
  }, [tooltipsReady]);

  const actions = {
    theme,
    toggleTheme,
    logout,
    isLoading,
  };

  return (
    <div className="d-lg-flex flex-column flex-shrink-0 d-none bg-dark z-3 vh-100 position-fixed start-0 top-0 rounded-top-end-4 rounded-bottom-end-4">
      <Link
        to={invoicesListUrl}
        className="d-block py-3 text-decoration-none bg-primary text-white text-center position-relative rounded-top-end-4 rounded-bottom-end-4 overflow-hidden"
      >
        <img
          src={logoSvg}
          width={28}
          height={26}
          className="my-1 position-relative z-2"
          alt="Invoicer logo - a circle with a missing slice"
        />
        <span className="visually-hidden user-select-none">Home</span>
        <div
          className="position-absolute start-50 top-100 translate-middle rounded-start-5 opacity-50"
          style={{
            width: "4.125rem",
            height: "4.125rem",
            backgroundColor: "#9277FF",
          }}
        ></div>
      </Link>
      <div className="mt-auto px-2 pb-2">
        <div
          className="vstack gap-3"
          onPointerEnter={prefetchTooltips}
          onFocusCapture={prefetchTooltips}
        >
          {tooltipsReady ? (
            <Suspense fallback={<DesktopNavbarActions {...actions} />}>
              <LazyDesktopNavbarTooltipActions {...actions} />
            </Suspense>
          ) : (
            <DesktopNavbarActions {...actions} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DesktopNavbar;
