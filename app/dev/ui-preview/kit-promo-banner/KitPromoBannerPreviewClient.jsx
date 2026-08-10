"use client";

import { useState } from "react";

import KitPromoBannerView from "@/components/kit/promo-banner/KitPromoBanner.view";
import {
  kitPromoBannerCardFixture,
  kitPromoBannerGalaxyTopFixture,
  kitPromoBannerLongestCopyFixture,
  kitPromoBannerNoCtaFixture,
  kitPromoBannerNoImageFixture,
  kitPromoBannerTopFixture,
} from "@/components/kit/promo-banner/KitPromoBanner.fixtures";
import KitPreviewShell from "../kit-batch-1/KitPreviewShell";

const STATES = {
  top: { label: "Top", props: kitPromoBannerTopFixture },
  galaxy: { label: "Top, galaxy", props: kitPromoBannerGalaxyTopFixture },
  card: { label: "In-flow card", props: kitPromoBannerCardFixture },
  longest: { label: "Longest copy", props: kitPromoBannerLongestCopyFixture },
  noImage: { label: "No image", props: kitPromoBannerNoImageFixture },
  noCta: { label: "No CTA", props: kitPromoBannerNoCtaFixture },
};

export default function KitPromoBannerPreviewClient() {
  const [activeKey, setActiveKey] = useState("top");
  const [lastAction, setLastAction] = useState(
    "Preview loaded. No page navigation is connected."
  );

  const active = STATES[activeKey];

  return (
    <KitPreviewShell
      title="Kit Promo Banner"
      description="The three ruled treatments. Both bottom sub-variants render side by side below, for Brian's ruling between uniform and bottom-fade."
      states={Object.entries(STATES).map(([key, state]) => ({
        key,
        label: state.label,
      }))}
      activeKey={activeKey}
      onSelectState={setActiveKey}
      note={lastAction}
    >
      <div className="flex flex-col gap-[var(--space-6)]">
        <KitPromoBannerView
          {...active.props}
          onCtaClick={() => setLastAction("CTA clicked (local preview only).")}
        />

        <div className="flex flex-col gap-[var(--space-3)]">
          <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
            Bottom treatment, both sub-variants
          </p>
          <div className="grid grid-cols-1 gap-[var(--space-4)] md:grid-cols-2">
            <div className="flex flex-col gap-[var(--space-2)]">
              <p className="text-[length:var(--text-label)] text-[var(--ink-dim)]">Uniform (default)</p>
              <KitPromoBannerView
                treatment="bottom"
                bottomVariant="uniform"
                eyebrow="Explore"
                title="Follow the creators behind every world you love."
                line=""
                ctaLabel="Browse creators"
                imageSrc={kitPromoBannerTopFixture.imageSrc}
                onCtaClick={() => setLastAction("Bottom uniform CTA clicked (local preview only).")}
              />
            </div>
            <div className="flex flex-col gap-[var(--space-2)]">
              <p className="text-[length:var(--text-label)] text-[var(--ink-dim)]">Bottom-fade</p>
              <KitPromoBannerView
                treatment="bottom"
                bottomVariant="bottom-fade"
                eyebrow="Explore"
                title="Follow the creators behind every world you love."
                line=""
                ctaLabel="Browse creators"
                imageSrc={kitPromoBannerTopFixture.imageSrc}
                onCtaClick={() => setLastAction("Bottom-fade CTA clicked (local preview only).")}
              />
            </div>
          </div>
        </div>
      </div>
    </KitPreviewShell>
  );
}
