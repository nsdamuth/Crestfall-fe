import { notFound } from "next/navigation";

import ActorMechanicsProfileBuilderPreviewClient from "./ActorMechanicsProfileBuilderPreviewClient";

export default function ActorMechanicsProfileBuilderPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-8 text-[var(--foreground)] sm:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
          Development UI Preview
        </p>
        <h1 className="mt-2 font-display text-4xl">
          Actor Mechanics Profile Builder
        </h1>
        <ActorMechanicsProfileBuilderPreviewClient />
      </div>
    </main>
  );
}
