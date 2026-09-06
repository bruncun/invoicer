import {
  lazy,
  Suspense,
  useCallback,
  useState,
} from "react";
import { Link } from "@remix-run/react";
import logoSvg from "~/assets/logo.svg";
import NavbarActions, { type NavbarActionsProps } from "./actions";

type NavbarProps = NavbarActionsProps;

const tooltipStylesheetSelector =
  'link[data-invoicer-tooltip-styles="true"]';
let tooltipModulePromise: Promise<typeof import("./tooltip-actions")> | undefined;
let tooltipStylesheetPromise: Promise<void> | undefined;

const loadTooltipModule = () => {
  tooltipModulePromise ??= import("./tooltip-actions");
  return tooltipModulePromise;
};

const LazyTooltipNavbarActions = lazy(loadTooltipModule);

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

const Navbar = ({ theme, toggleTheme }: NavbarProps) => {
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

  const actions = { theme, toggleTheme };

  return (
    <nav className="app-navbar navbar navbar-expand-lg bg-dark fixed-top z-3">
      <Link className="app-navbar-brand" to="/">
        <img
          src={logoSvg}
          width={28}
          height={26}
          className="app-navbar-logo position-relative z-2"
          alt="Invoicer logo - a circle with a missing slice"
        />
        <span className="visually-hidden user-select-none">Home</span>
        <div className="app-navbar-logo-accent" />
      </Link>
      <div
        className="app-navbar-actions"
        onPointerEnter={prefetchTooltips}
        onFocusCapture={prefetchTooltips}
      >
        {tooltipsReady ? (
          <Suspense fallback={<NavbarActions {...actions} />}>
            <LazyTooltipNavbarActions {...actions} />
          </Suspense>
        ) : (
          <NavbarActions {...actions} />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
