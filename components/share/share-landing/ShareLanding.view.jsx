// ShareLanding.view: stateless presentation of the public share
// landing (contract 1.0.0). The card's content as page text, readable
// without zoom at 390, in a deliberate two-column layout from 1024 up.
// Theme values only; the one action is the gold primary at 44px.
import Link from "next/link";
import { Play } from "lucide-react";

import KitBadgeView from "@/components/kit/badge/KitBadge.view";

export const SHARE_LANDING_TITLE_ID = "share-landing-title";

// The Crestfall Studio lockup in the header slot (follow-up 1, item 4):
// the same mark and wordmark the studio sidebar renders
// (StudioSidebar.view.jsx, public/assets/icons/icons-v7.svg#i-59), at
// the sidebar's own proportions. Decorative on this page: the h1 is
// the creation's title.
function Lockup() {
  return (
    <div className="flex items-center gap-[var(--space-2)]">
      <svg viewBox="0 0 64 64" aria-hidden="true" className="h-10 w-10 shrink-0 text-[var(--gold-ornament)]">
        <use href="/assets/icons/icons-v7.svg#i-59" />
      </svg>
      <span>
        <p className="font-display text-[length:var(--text-ui)] font-[var(--weight-medium)] uppercase leading-none tracking-[.04em] text-[color:var(--ink)] first-letter:text-[1.45em]">
          Crestfall
        </p>
        <p className="mt-[2px] text-[length:var(--text-label)] uppercase leading-none tracking-[var(--track-label)] text-[color:var(--ink-faint)]">
          Studio
        </p>
      </span>
    </div>
  );
}

function Art({ src = "", title = "" }) {
  return (
    <div className="relative aspect-[5/3] w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-1)] lg:aspect-[4/5]">
      {src ? (
        <img
          src={src}
          alt={title ? `Featured image for ${title}` : ""}
          className="absolute inset-0 h-full w-full object-cover object-[center_18%]"
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center bg-[var(--surface-2)] font-display text-[length:var(--text-heading)] text-[var(--ink-faint)]"
          aria-hidden="true"
        >
          Crestfall
        </div>
      )}
    </div>
  );
}

export default function ShareLandingView({
  kindLabel = "",
  isCanon = false,
  title = "",
  byline = "",
  creatorHref = null,
  excerpt = "",
  imageSrc = "",
  actionLabel = "Play free on Crestfall Studio",
  actionHref = "/login",
  errorMessage = "",
}) {
  return (
    <main className="min-h-dvh bg-[var(--canvas)] text-[var(--ink)]">
      <a
        href="#share-landing-action"
        className="sr-only focus:not-sr-only focus:fixed focus:left-[var(--space-4)] focus:top-[var(--space-4)] focus:z-[2] focus:rounded-[var(--radius-md)] focus:bg-[var(--surface-3)] focus:px-[var(--space-4)] focus:py-[var(--space-2)]"
      >
        Skip to the action
      </a>

      <div className="mx-auto w-full max-w-[64rem] px-[var(--space-5)] py-[var(--space-8)] lg:py-[var(--space-14)]">
        {errorMessage ? (
          <p className="text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">{errorMessage}</p>
        ) : (
          <div className="grid grid-cols-1 gap-[var(--space-6)] lg:grid-cols-[28rem_minmax(0,1fr)] lg:items-center lg:gap-[var(--space-14)]">
            <Art src={imageSrc} title={title} />

            <div className="flex min-w-0 flex-col gap-[var(--space-4)]">
              <Lockup />

              {kindLabel || isCanon ? (
                <div className="flex flex-wrap gap-[var(--space-1)]">
                  {isCanon ? <KitBadgeView label="Canon" variant="canon" surface="canvas" /> : null}
                  {kindLabel ? <KitBadgeView label={kindLabel} variant="meta" surface="canvas" /> : null}
                </div>
              ) : null}

              <h1
                id={SHARE_LANDING_TITLE_ID}
                className="font-display text-[length:var(--text-title)] leading-[var(--lh-title)] text-[var(--ink)] [text-wrap:balance] lg:text-[length:var(--text-display)] lg:leading-[var(--lh-display)]"
              >
                {title || "Untitled"}
              </h1>

              {byline ? (
                <p className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
                  {creatorHref ? (
                    <Link href={creatorHref} className="hover:text-[var(--gold-ornament)]">
                      {byline}
                    </Link>
                  ) : (
                    byline
                  )}
                </p>
              ) : null}

              {excerpt ? (
                <p className="max-w-[var(--measure)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)] [text-wrap:pretty]">
                  {excerpt}
                </p>
              ) : null}

              <div className="mt-[var(--space-2)]">
                <Link
                  id="share-landing-action"
                  href={actionHref}
                  className="goldring cf-btn cf-btn--primary flex w-full items-center justify-center gap-[var(--space-2)] sm:inline-flex sm:w-auto"
                >
                  <Play size={16} aria-hidden="true" />
                  {actionLabel}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
