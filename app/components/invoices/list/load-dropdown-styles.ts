let dropdownStylesPromise: Promise<typeof import("~/styles/dropdown")> | undefined;

export const loadDropdownStyles = () =>
  (dropdownStylesPromise ??= import("~/styles/dropdown"));
