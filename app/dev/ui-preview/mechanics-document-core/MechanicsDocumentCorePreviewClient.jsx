"use client";

import MechanicsDocumentCore from "@/components/studio/my-creations/edit/sections/mechanics-modules/mechanics-core/MechanicsDocumentCore";

export default function MechanicsDocumentCorePreviewClient() {
  return (
    <main className="min-h-screen bg-black px-5 py-8 text-[var(--foreground)] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[110rem]">
        <MechanicsDocumentCore />
      </div>
    </main>
  );
}
