"use client";

import LorePublicationReadinessView from "@/components/studio/create/lore/lore-publication-readiness/LorePublicationReadiness.view";

const checks = [
  { id: "title", label: "Creation title is set", detail: "The public reader needs a clear Lore title.", complete: true, required: true },
  { id: "description", label: "Creation description is set", detail: "The creation summary is used by discovery and reader surfaces.", complete: true, required: true },
  { id: "chapters", label: "At least one chapter exists", detail: "2 chapters in the current editor.", complete: true, required: true },
  { id: "sections", label: "At least one section exists", detail: "5 sections in the current editor.", complete: true, required: true },
  { id: "content", label: "Lore contains content blocks", detail: "14 blocks in the current editor.", complete: true, required: true },
  { id: "validation", label: "No blocking Lore validation errors", detail: "The current Lore document passes structural validation.", complete: true, required: true },
];

function PreviewLink({ href, children, ...props }) {
  return (
    <a
      {...props}
      href={href}
      onClick={(event) => event.preventDefault()}
    >
      {children}
    </a>
  );
}

export default function LorePublicationSafetyPreviewClient() {
  return (
    <main className="min-h-screen bg-black px-5 py-8 text-[var(--foreground)] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 rounded-2xl border border-white/10 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
            Development Safety Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">Lore Publication Safety</h1>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-[var(--muted)]">
            This fixture shows a structurally ready Lore draft with unsaved editor changes.
            The validation action must remain disabled until the normal Creation save succeeds.
          </p>
        </header>

        <LorePublicationReadinessView
          checks={checks}
          completedCheckCount={checks.length}
          totalCheckCount={checks.length}
          completedRequiredCount={checks.length}
          requiredCheckCount={checks.length}
          isAuthoringReady
          hasUnsavedChanges
          summary={{ chapterCount: 2, sectionCount: 5, blockCount: 14 }}
          lifecycleStatus="DRAFT"
          visibility="PRIVATE"
          publicReleaseStatus="PUBLIC"
          contentRating="SFW"
          ownerPreviewHref="#owner-preview"
          LinkComponent={PreviewLink}
          latestValidation={{
            id: "validation-preview",
            status: "PASSED",
            createdAt: "2026-08-01T18:00:00.000Z",
            completedAt: "2026-08-01T18:04:00.000Z",
            totalChunks: 4,
            completedChunks: 4,
          }}
          validationSubmissions={[]}
          activePublication={{
            revisionNumber: 2,
            publishedAt: "2026-08-01T18:10:00.000Z",
          }}
          publicHref="#public-lore"
          canSubmitValidation={false}
          canPublishValidatedRevision={false}
          submitValidation={() => {}}
          cancelValidation={() => {}}
          publishValidatedRevision={() => {}}
          refreshValidation={() => {}}
        />
      </div>
    </main>
  );
}
