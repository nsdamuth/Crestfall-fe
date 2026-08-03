"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import LoreCard from "@/components/LoreCard";
import FilterableIndexView from "@/components/filterable-index/FilterableIndex.view";
import useFilterableIndexViewModel from "@/components/filterable-index/useFilterableIndexViewModel";

export default function FilterableIndex({
  entries = [],
  filters = [],
  emptyText = "No matching records found.",
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const viewProps = useFilterableIndexViewModel({
    entries,
    filters,
    emptyText,
    pathname,
    queryString: searchParams.toString(),
    onReplaceUrl: (href) => router.replace(href, { scroll: false }),
  });

  return (
    <FilterableIndexView
      {...viewProps}
      renderCard={(card) => <LoreCard key={card.key} {...card} />}
    />
  );
}
