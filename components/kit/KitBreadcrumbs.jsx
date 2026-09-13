import Link from "next/link";

import KitBreadcrumbsView from "./breadcrumbs/KitBreadcrumbs.view";
import { useKitBreadcrumbsViewModel } from "./breadcrumbs/useKitBreadcrumbsViewModel";

// Shell: injects next/link so every crumb navigates client-side. The
// ViewModel is a pure normalizer (no hooks), so this shell renders
// inside server and client trees alike.
export default function KitBreadcrumbs(props) {
  const viewProps = useKitBreadcrumbsViewModel({ ...props, LinkComponent: Link });

  return <KitBreadcrumbsView {...viewProps} />;
}
