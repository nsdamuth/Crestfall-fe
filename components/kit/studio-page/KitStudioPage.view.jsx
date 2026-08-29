"use client";

// Content width law (R1, docs/BUILD-BLUEPRINT.md 2.16(l)), amended by
// Container law ruling 29 Aug 2026: one content width per page,
// StudioShell itself stays fluid (24 Aug supersession stands), but
// this view is the single width authority for every v2 page's
// foreground content, so it caps and centers here at
// --container-wide. The filter bar slot is a direct child of the
// root with no wrapper, so its own negative margins meet the shell
// padding with nothing in between.
export default function KitStudioPageView({
  harnessSlot = null,
  headerSlot = null,
  headerAlign = "left",
  filterBarSlot = null,
  bannerSlot = null,
  children = null,
  compactMobile = false,
}) {
  return (
    <div
      className={`mx-auto flex w-full max-w-[var(--container-wide)] flex-col ${
        compactMobile
          ? "gap-[var(--space-4)] pb-[var(--space-2)] sm:gap-[var(--space-6)] sm:pb-[var(--space-6)]"
          : "gap-[var(--space-6)] pb-[var(--space-6)]"
      }`}
    >
      {harnessSlot}
      {headerSlot ? (
        headerAlign === "center" ? (
          <div className="flex flex-col items-center text-center">{headerSlot}</div>
        ) : (
          headerSlot
        )
      ) : null}
      {filterBarSlot}
      <div
        className={
          compactMobile
            ? "flex flex-col gap-[var(--space-4)] sm:gap-[var(--space-6)]"
            : "flex flex-col gap-[var(--space-6)]"
        }
      >
        {children}
      </div>
      {bannerSlot}
    </div>
  );
}
