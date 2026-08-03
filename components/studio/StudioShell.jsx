"use client";

import StudioSidebar from "@/components/studio/StudioSidebar";
import StudioMobileNav from "@/components/studio/StudioMobileNav";
import StudioTopBar from "@/components/studio/StudioTopBar";
import { StudioAccountProvider } from "@/components/studio/StudioAccountProvider";

export default function StudioShell({ user, children }) {
  return (
    <StudioAccountProvider>
      <main className="min-h-screen bg-black text-[var(--foreground)]">
        <div className="flex min-h-screen">
          <StudioSidebar user={user} />

          <section className="min-w-0 flex-1 px-5 pb-24 pt-20 sm:px-8 lg:px-10 lg:py-8">
            <StudioMobileNav user={user} />
            <StudioTopBar user={user} />
            {children}
          </section>
        </div>
      </main>
    </StudioAccountProvider>
  );
}
