"use client";

export default function StudioShellView({
  sidebarSlot = null,
  mobileNavSlot = null,
  topBarSlot = null,
  reserveMobileDockSpace = true,
  flush = false,
  themeMode = "dark",
  children = null,
}) {
  // flush (1.4.0, fe/chat-studio item 1): a full-screen workspace such
  // as story chat owns its own edges, so the section drops every gutter
  // and becomes a min-h-0 flex column the page can fill exactly. The
  // padded branch is byte for byte the pre-1.4.0 string.
  const sectionClassName = flush
    ? "min-w-0 w-full flex-1 flex min-h-0 flex-col overflow-hidden p-0"
    : `min-w-0 w-full flex-1 px-[var(--space-5)] pt-0 sm:px-[var(--space-8)] lg:px-[var(--space-10)] lg:pb-[var(--space-8)] ${
        reserveMobileDockSpace ? "pb-24" : "pb-0"
      }`;

  return (
    <main
      data-studio-shell=""
      data-theme={themeMode === "light" ? "light" : undefined}
      className="min-h-screen bg-[var(--canvas)] text-[var(--ink)]"
    >
      {/* Package MOBILE-SHELLS: data-studio-shell is the scope hook
          for the mobile shell law in app/design-system.css (heading
          and prose wrapping, media capped at the column, tables and
          pre scrolling inside themselves). It reaches every route
          under /studio through this one element and nothing outside
          it. */}
      <div className="flex min-h-screen">
        {sidebarSlot}

        <div className="flex min-w-0 flex-1 flex-col">
          {mobileNavSlot}
          {topBarSlot}

          <section className={sectionClassName}>{children}</section>
        </div>
      </div>
    </main>
  );
}
