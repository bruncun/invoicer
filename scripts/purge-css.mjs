import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PurgeCSS } from "purgecss";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cssFiles = [
  "app/index.css",
  "public/invoice-details.css",
  "public/invoice-form.css",
  "public/toast.css",
  "public/tooltip.css",
];

// React-Bootstrap and Headless UI create some class names from props or state.
// Keep those classes so runtime states remain styled after purging.
const safelist = {
  standard: [
    "active",
    "alert",
    "badge",
    "backdrop",
    "btn",
    "card",
    "collapse",
    "container",
    "disabled",
    "dropdown",
    "fade",
    "fixed-bottom",
    "fixed-top",
    "form-control",
    "form-label",
    "hstack",
    "input",
    "invalid-feedback",
    "is-invalid",
    "modal",
    "nav",
    "navbar",
    "navbar-dark",
    "navbar-light",
    "page-item",
    "page-link",
    "pagination",
    "placeholder",
    "row",
    "show",
    "spinner-border",
    "table",
    "toast",
    "tooltip",
    "vstack",
    "optgroup",
    "gap-3",
    /^alert-/,
    /^badge-/,
    /^bg-(body-secondary|dark|danger|secondary|success|warning|white)(-subtle)?$/,
    /^bi-/,
    // Keep only the Button variants React-Bootstrap generates in the app.
    // `btn-danger` is used by the invoice deletion action.
    /^btn-(close(?:-white)?|dark|danger|link|primary|secondary)$/,
    /^col(?:-(sm|md|lg|xl|xxl))?(?:-\d+)?$/,
    /^container(?:-(sm|md|lg|xl|xxl|fluid))?$/,
    /^dropdown-(center|item(?:-text)?|menu|toggle)$/,
    // `Form.Check` generates its Bootstrap classes at runtime. Keep this
    // family, but do not retain unrelated form features such as ranges,
    // floating labels, and size variants that are not used by the app shell.
    /^form-check/,
    /^modal-/,
    /^nav-/,
    /^navbar-expand-lg$/,
    /^placeholder-/,
    /^spinner-border/,
    /^table-/,
    /^text-(danger|success|warning|secondary)-emphasis$/,
    /^toast-/,
    /^tooltip-/,
    /^bs-tooltip-/,
  ],
  deep: [/^\.modal/, /^\.dropdown/, /^\.toast/],
};

// Some unused Bootstrap selectors match source file names (for example,
// `list-group.tsx`). Reject them explicitly instead of retaining their CSS.
const blocklist = [
  /^dropdown-menu-/,
  "dropdown-divider",
  "dropdown-header",
  /^navbar-expand(?:-(?!lg$).*)?$/,
  "navbar-nav-scroll",
  /^card-header(?:-|$)/,
  /^card-img(?:-|$)/,
  "list-group",
  "progress",
  "sub",
];

const result = await new PurgeCSS().purge({
  content: [resolve(root, "app/**/*.{js,jsx,ts,tsx}")],
  css: cssFiles.map((file) => resolve(root, file)),
  fontFace: false,
  keyframes: true,
  variables: true,
  safelist,
  blocklist,
  sourceMap: false,
});

for (const [index, file] of cssFiles.entries()) {
  const output = result[index];
  const original = await readFile(resolve(root, file), "utf8");
  const css = output.css.replace(/\s*\/\*# sourceMappingURL=.*?\*\/\s*$/, "");

  await writeFile(resolve(root, file), `${css.trimEnd()}\n`);

  const removedBytes = Buffer.byteLength(original) - Buffer.byteLength(css);
  console.log(`${file}: removed ${removedBytes} bytes`);
}
