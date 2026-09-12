"use client";

export default function StudioShellView({
  sidebarSlot = null,
  mobileNavSlot = null,
  topBarSlot = null,
  reserveMobileDockSpace = true,
  themeMode = "dark",
  children = null,
}) {
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

          <section
            className={`min-w-0 w-full flex-1 px-[var(--space-5)] pt-0 sm:px-[var(--space-8)] lg:px-[var(--space-10)] lg:pb-[var(--space-8)] ${
              reserveMobileDockSpace ? "pb-24" : "pb-0"
            }`}
          >
            {children}
          </section>
        </div>
      </div>
    </main>
  );
}
