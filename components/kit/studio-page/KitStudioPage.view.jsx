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
  headerAlign = "left",
  filterBarSlot = null,
  bannerSlot = null,
  children = null,
  compactMobile = false,
}) {
  return (
    <div
      className={`flex flex-col ${
        compactMobile
          ? "gap-[var(--space-4)] py-[var(--space-2)] sm:gap-[var(--space-6)] sm:py-[var(--space-6)]"
          : "gap-[var(--space-6)] py-[var(--space-6)]"
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
