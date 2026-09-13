function toItems(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => item && typeof item.label === "string" && item.label.trim())
    .map((item) => ({
      label: item.label.trim(),
      href: typeof item.href === "string" && item.href ? item.href : null,
    }));
}

export function useKitBreadcrumbsViewModel(props) {
  return {
    items: toItems(props?.items),
    ariaLabel:
      typeof props?.ariaLabel === "string" && props.ariaLabel ? props.ariaLabel : "Breadcrumb",
    LinkComponent: props?.LinkComponent || "a",
  };
}
