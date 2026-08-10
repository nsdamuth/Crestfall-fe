"use client";

// Content width law (R1, docs/BUILD-BLUEPRINT.md 2.16(l)): one
// content width per page. StudioShell's own section padding is the
// page container margin and nothing else adds one. This view renders
// NO horizontal class anywhere: no padding, no max-width, no
// centering margin. The filter bar slot is a direct child of the
// root with no wrapper, so its own negative margins meet the shell
// padding with nothing in between.
export default function KitStudioPageView({
  harnessSlot = null,
  headerSlot = null,
  filterBarSlot = null,
  bannerSlot = null,
  children = null,
}) {
  return (
    <div className="flex flex-col gap-[var(--space-6)] py-[var(--space-6)]">
      {harnessSlot}
      {headerSlot}
      {filterBarSlot}
      <div className="flex flex-col gap-[var(--space-6)]">{children}</div>
      {bannerSlot}
    </div>
  );
}
