import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PurgeCSS } from "purgecss";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cssFiles = [
  "app/index.css",
  "public/invoice-form.css",
  "public/toast.css",
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
    "form-select",
    "hstack",
    "input",
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
    "textarea",
    "vstack",
    "optgroup",
    "gap-3",
    /^alert-/,
    /^badge-/,
    /^bg-(body-secondary|dark|danger|secondary|success|warning|white)(-subtle)?$/,
    /^bi-/,
    /^btn-/,
    /^card-/,
    /^col(?:-(sm|md|lg|xl|xxl))?(?:-\d+)?$/,
    /^container(?:-(sm|md|lg|xl|xxl|fluid))?$/,
    /^dropdown-/,
    /^form-/,
    /^modal-/,
    /^nav-/,
    /^navbar-/,
    /^placeholder-/,
    /^spinner-/,
    /^table-/,
    /^text-(danger|success|warning|secondary)-emphasis$/,
    /^toast-/,
  ],
  deep: [/^\.modal/, /^\.dropdown/, /^\.toast/],
};

const result = await new PurgeCSS().purge({
  content: [resolve(root, "app/**/*.{js,jsx,ts,tsx}")],
  css: cssFiles.map((file) => resolve(root, file)),
  fontFace: false,
  keyframes: false,
  variables: false,
  safelist,
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
