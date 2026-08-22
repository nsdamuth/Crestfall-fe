"use client";

import { useEffect, useState } from "react";
import {
  ChevronsDown,
  ChevronsUp,
  List,
} from "lucide-react";

export const MECHANICS_RUNTIME_QUICK_LINKS = [
  {
    id: "mechanics-runtime-overview",
    key: "overview",
    label: "Overview",
  },
  {
    id: "mechanics-runtime-trackers",
    key: "trackers",
    label: "Trackers / Meters",
  },
  {
    id: "mechanics-runtime-commands",
    key: "commands",
    label: "Commands",
  },
  {
    id: "mechanics-runtime-defaults",
    key: "defaults",
    label: "Defaults",
  },
  {
    id: "mechanics-runtime-status-blocks",
    key: "statusBlocks",
    label: "Status Blocks",
  },
  {
    id: "mechanics-runtime-guards",
    key: "guards",
    label: "Guards",
  },
];

function normalizeRuntimeArray(value) {
  return Array.isArray(value) ? value : [];
}

export function getMechanicsRuntimeQuickLinkCounts(form = {}) {
  const data =
    form?.data &&
    typeof form.data === "object" &&
    !Array.isArray(form.data)
      ? form.data
      : {};

  const instanceData =
    data.instanceData &&
    typeof data.instanceData === "object" &&
    !Array.isArray(data.instanceData)
      ? data.instanceData
      : {};

  const defaults =
    instanceData.defaults &&
    typeof instanceData.defaults === "object" &&
    !Array.isArray(instanceData.defaults)
      ? instanceData.defaults
      : {};

  return {
    overview: null,
    trackers: normalizeRuntimeArray(instanceData.trackers).length,
    commands: normalizeRuntimeArray(instanceData.commands).length,
    defaults:
      normalizeRuntimeArray(defaults.flags).length +
      normalizeRuntimeArray(defaults.counters).length +
      normalizeRuntimeArray(defaults.stages).length,
    statusBlocks: normalizeRuntimeArray(instanceData.statusBlocks).length,
    guards: normalizeRuntimeArray(instanceData.guards).length,
  };
}

export default function CreationEditMechanicsRuntimeQuickNav({ form }) {
  const [activeSectionId, setActiveSectionId] = useState(
    "mechanics-runtime-overview"
  );
  const counts = getMechanicsRuntimeQuickLinkCounts(form);

  useEffect(() => {
    function handleActiveSection(event) {
      const sectionId = event?.detail?.sectionId;

      if (
        MECHANICS_RUNTIME_QUICK_LINKS.some(
          (link) => link.id === sectionId
        )
      ) {
        setActiveSectionId(sectionId);
      }
    }

    window.addEventListener(
      "crestfall:mechanics-runtime-active",
      handleActiveSection
    );

    return () => {
      window.removeEventListener(
        "crestfall:mechanics-runtime-active",
        handleActiveSection
      );
    };
  }, []);

  function navigate(sectionId) {
    setActiveSectionId(sectionId);
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}#${sectionId}`
    );
    window.dispatchEvent(
      new CustomEvent(
        "crestfall:mechanics-runtime-navigate",
        {
          detail: {
            sectionId,
          },
        }
      )
    );
  }

  function setAllExpanded(expanded) {
    window.dispatchEvent(
      new CustomEvent(
        "crestfall:mechanics-runtime-fold-all",
        {
          detail: {
            expanded,
          },
        }
      )
    );
  }

  return (
    // Section 5: no second bordered depth inside the section box this
    // nav mounts inside (D2). Inset-hairline sub-group, same pattern
    // as Personality Frameworks/Template Operations: no border, no
    // background, tier 4 label plus one helper line, then content.
    <nav aria-label="Runtime Fields quick links" className="relative z-20 xl:sticky xl:top-6">
      <div className="flex items-center gap-[var(--space-3)]">
        <List size={16} className="flex-none text-[var(--gold-ornament)]" aria-hidden="true" />

        <div className="min-w-0">
          <p className="flex items-center gap-[var(--space-2)] text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:flex-1 after:bg-[image:var(--grad-rule)]">
            Runtime Fields
          </p>
          <p className="mt-[var(--space-1)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
            Jump to a section
          </p>
        </div>
      </div>

      <div className="mt-[var(--space-3)] grid gap-[var(--space-1)]">
        {MECHANICS_RUNTIME_QUICK_LINKS.map((link) => {
          const active = activeSectionId === link.id;
          const count = counts[link.key];

          return (
            <button
              key={link.id}
              type="button"
              onClick={() => navigate(link.id)}
              className={`kit-focus flex items-center justify-between gap-[var(--space-3)] rounded-[var(--radius-sm)] px-[var(--space-3)] py-[var(--space-2)] text-left text-[length:var(--text-ui)] leading-[var(--lh-ui)] transition ${
                active
                  ? "bg-[var(--fill)] text-[var(--gold-bright)]"
                  : "text-[var(--ink-dim)] hover:text-[var(--ink)]"
              }`}
            >
              <span>{link.label}</span>

              {count !== null ? (
                <span className="tabular-nums text-[length:var(--text-label)] text-[var(--ink-faint)]">
                  {count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="mt-[var(--space-4)] grid grid-cols-2 gap-[var(--space-2)] border-t border-[var(--line-whisper)] pt-[var(--space-4)]">
        <button
          type="button"
          onClick={() => setAllExpanded(false)}
          className="cf-btn cf-btn--secondary cf-btn--sm"
        >
          <ChevronsUp size={13} />
          Collapse
        </button>

        <button
          type="button"
          onClick={() => setAllExpanded(true)}
          className="cf-btn cf-btn--secondary cf-btn--sm"
        >
          <ChevronsDown size={13} />
          Expand
        </button>
      </div>
    </nav>
  );
}
