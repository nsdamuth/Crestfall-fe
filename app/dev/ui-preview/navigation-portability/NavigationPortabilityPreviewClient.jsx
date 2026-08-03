"use client";

import { useState } from "react";

import CreationCreditsView from "@/components/studio/creations/creation-credits/CreationCredits.view";
import CreateTypeCardView from "@/components/studio/create/create-type-card/CreateTypeCard.view";
import { NAVIGATION_PORTABILITY_TARGETS } from "@/components/studio/navigation-portability/NavigationPortability.targets.mjs";
import StudioActionCardView from "@/components/studio/studio-action-card/StudioActionCard.view";
import StudioBackLinkView from "@/components/studio/studio-back-link/StudioBackLink.view";
import StudioCharacterCardView from "@/components/studio/studio-character-card/StudioCharacterCard.view";
import CharacterTemplateGalleryView from "@/components/studio/templates/character-template-gallery/CharacterTemplateGallery.view";

export default function NavigationPortabilityPreviewClient() {
  const [lastDestination, setLastDestination] = useState("No preview link selected");

  function PreviewLink({ href = "#", children, onClick, ...props }) {
    return (
      <a
        {...props}
        href={href}
        onClick={(event) => {
          event.preventDefault();
          onClick?.(event);
          setLastDestination(String(href));
        }}
      >
        {children}
      </a>
    );
  }

  return (
    <main className="min-h-screen bg-black px-5 py-8 text-[var(--foreground)] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="rounded-2xl border border-white/10 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
            Development Audit Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            LOOM Navigation Portability
          </h1>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-[var(--muted)]">
            Representative portable Views below receive a local link component.
            Selecting a link records its unchanged destination without leaving this
            fixture-only page. Static diagnostics cover all 16 hardened Views.
          </p>
          <p className="mt-4 rounded-xl border border-[var(--muted-gold)]/25 bg-[var(--muted-gold)]/10 px-4 py-3 text-sm text-[var(--muted-gold)]">
            Last destination: {lastDestination}
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {NAVIGATION_PORTABILITY_TARGETS.map((target) => (
            <article
              key={target.id}
              className="rounded-xl border border-white/10 bg-black/25 p-4"
            >
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)]">
                {target.label}
              </p>
              <p className="mt-2 break-all text-xs leading-5 text-[var(--muted)]">
                {target.viewPath}
              </p>
              {target.previewHref ? (
                <PreviewLink
                  href={target.previewHref}
                  className="mt-3 inline-flex text-xs text-[var(--foreground)] underline decoration-[var(--muted-gold)]/50 underline-offset-4"
                >
                  Record preview route
                </PreviewLink>
              ) : (
                <p className="mt-3 text-xs text-[var(--muted)]">
                  Covered by parent production integration.
                </p>
              )}
            </article>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className="space-y-5 rounded-2xl border border-white/10 bg-black/25 p-6">
            <StudioBackLinkView
              href="#studio-root"
              label="Portable Back Link"
              LinkComponent={PreviewLink}
            />

            <CreateTypeCardView
              title="Portable Creation Card"
              eyebrow="Injected Navigation"
              description="The View renders without importing Next.js and preserves the supplied destination."
              href="/studio/create/character"
              LinkComponent={PreviewLink}
            />

            <StudioActionCardView
              eyebrow="Hardening"
              title="Binding Shell Owns Routing"
              href="/studio"
              actionLabel="Open Studio"
              LinkComponent={PreviewLink}
            >
              The portable card owns presentation while the application shell supplies
              the navigation implementation.
            </StudioActionCardView>
          </div>

          <div className="space-y-5 rounded-2xl border border-white/10 bg-black/25 p-6">
            <StudioCharacterCardView
              title="Aster Vale"
              eyebrow="Official Character"
              description="Representative character-card navigation with an injected local link."
              detailsHref="/studio/creations/preview-character"
              LinkComponent={PreviewLink}
            />

            <CreationCreditsView
              credits={[
                {
                  id: "credit-1",
                  kindLabel: "Character inspiration",
                  creatorHref: "/studio/profile/preview-creator",
                  creatorHandle: "preview_creator",
                  assetTitle: "Aster Vale",
                },
              ]}
              LinkComponent={PreviewLink}
            />
          </div>
        </section>

        <CharacterTemplateGalleryView
          templates={[
            {
              id: "preview-template",
              title: "Portable Hero",
              category: "Fixture",
              description:
                "A representative gallery state using the injected navigation primitive.",
            },
          ]}
          createTemplateHref="/studio/create/character-template"
          sidebarBody="This fixture validates the gallery call-to-action without loading or saving Creations."
          LinkComponent={PreviewLink}
        />

        <div
          id="studio-root"
          className="rounded-xl border border-dashed border-white/10 bg-black/20 p-5 text-sm text-[var(--muted)]"
        >
          Local hash target used by the portable back-link fixture.
        </div>
      </div>
    </main>
  );
}
