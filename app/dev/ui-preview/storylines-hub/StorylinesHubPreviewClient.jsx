"use client";

import { useMemo, useState } from "react";

import StorylinesHubView from "@/components/studio/storylines/storylines-hub/StorylinesHub.view";
import {
  storylinesHubEmptyFixture,
  storylinesHubErrorFixture,
  storylinesHubLoadedFixture,
  storylinesHubLoadingFixture,
} from "@/components/studio/storylines/storylines-hub/StorylinesHub.fixtures";
import { getStorylinesHubViewProps } from "@/components/studio/storylines/storylines-hub/useStorylinesHubViewModel";

const STATES = Object.freeze({
  loaded: storylinesHubLoadedFixture,
  empty: storylinesHubEmptyFixture,
  loading: storylinesHubLoadingFixture,
  error: storylinesHubErrorFixture,
});

function PreviewLink({ href, children, ...props }) {
  return (
    <a href={href} {...props} onClick={(event) => event.preventDefault()}>
      {children}
    </a>
  );
}

export default function StorylinesHubPreviewClient() {
  const [stateKey, setStateKey] = useState("loaded");
  const viewProps = useMemo(
    () => getStorylinesHubViewProps(STATES[stateKey]),
    [stateKey]
  );

  return (
    <main className="min-h-screen bg-black px-5 py-8 text-[var(--foreground)] sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap gap-2">
          {Object.keys(STATES).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setStateKey(key)}
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.16em] transition ${
                stateKey === key
                  ? "border-[var(--muted-gold)] bg-[var(--muted-gold)]/15 text-[var(--foreground)]"
                  : "border-white/15 text-[var(--muted)] hover:border-[var(--muted-gold)]/40"
              }`}
            >
              {key}
            </button>
          ))}
        </div>

        <StorylinesHubView
          {...viewProps}
          InternalLinkComponent={PreviewLink}
        />
      </div>
    </main>
  );
}
