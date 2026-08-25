"use client";

export default function StudioShellView({
  sidebarSlot = null,
  mobileNavSlot = null,
  topBarSlot = null,
  children = null,
}) {
  return (
    <main className="min-h-screen bg-[var(--canvas)] text-[var(--ink)]">
      <div className="flex min-h-screen">
        {sidebarSlot}

        <div className="flex min-w-0 flex-1 flex-col">
          {mobileNavSlot}
          {topBarSlot}

          <section className="min-w-0 w-full flex-1 px-[var(--space-5)] pb-24 pt-[var(--space-20)] sm:px-[var(--space-8)] lg:px-[var(--space-10)] lg:py-[var(--space-8)]">
            {children}
          </section>
        </div>
      </div>
    </main>
  );
}
