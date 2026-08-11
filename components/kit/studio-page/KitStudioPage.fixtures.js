function placeholderBlock(label, heightClassName = "h-[var(--space-20)]") {
  return (
    <div
      className={`flex ${heightClassName} items-center justify-center rounded-[var(--radius-md)] border border-dashed border-[var(--line-strong)] bg-[var(--surface-1)] text-[length:var(--text-ui)] text-[var(--ink-faint)]`}
    >
      {label}
    </div>
  );
}

export const kitStudioPageDefaultFixture = {
  harnessSlot: placeholderBlock("Fixture-mode row", "h-[var(--space-9)]"),
  headerSlot: placeholderBlock("Header slot", "h-[var(--space-14)]"),
  filterBarSlot: placeholderBlock("Filter bar slot", "h-[var(--space-14)]"),
  bannerSlot: placeholderBlock("Banner slot"),
  children: placeholderBlock("Card grid / list", "h-[var(--space-24)]"),
};

export const kitStudioPageNoBannerFixture = {
  ...kitStudioPageDefaultFixture,
  bannerSlot: null,
};

export const kitStudioPageCenteredHeaderFixture = {
  ...kitStudioPageDefaultFixture,
  headerAlign: "center",
  headerSlot: placeholderBlock("Header slot, centered (Lore seat)", "h-[var(--space-14)]"),
};

export const kitStudioPageLongestContentFixture = {
  ...kitStudioPageDefaultFixture,
  children: (
    <div className="flex flex-col gap-[var(--space-4)]">
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index}>{placeholderBlock(`Content row ${index + 1}`, "h-[var(--space-24)]")}</div>
      ))}
    </div>
  ),
};
