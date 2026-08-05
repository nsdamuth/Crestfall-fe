"use client";

import StudioSidebar from "@/components/studio/StudioSidebar";
import StudioMobileNav from "@/components/studio/StudioMobileNav";
import StudioTopBar from "@/components/studio/StudioTopBar";
import { StudioAccountProvider } from "@/components/studio/StudioAccountProvider";

export default function StudioShell({ user, children }) {
  return (
    <StudioAccountProvider>
      <main className="min-h-screen bg-[var(--canvas)] text-[var(--ink)]">
        <div className="flex min-h-screen">
          <StudioSidebar user={user} />

          <section className="min-w-0 flex-1 px-[var(--space-5)] pb-24 pt-[var(--space-20)] sm:px-[var(--space-8)] lg:px-[var(--space-10)] lg:py-[var(--space-8)]">
            <StudioMobileNav user={user} />
            <StudioTopBar user={user} />
            {children}
          </section>
        </div>
      </main>
    </StudioAccountProvider>
  );
}
