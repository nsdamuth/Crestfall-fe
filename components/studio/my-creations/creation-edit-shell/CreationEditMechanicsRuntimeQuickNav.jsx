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
    <nav
      aria-label="Runtime Fields quick links"
      className="relative z-20 rounded-[var(--radius-md)] border border-[var(--muted-gold)]/20 bg-black p-4 xl:sticky xl:top-6"
    >
      <div className="flex items-center gap-3">
        <List
          size={16}
          className="text-[var(--muted-gold)]"
        />

        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
            Runtime Fields
          </p>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Jump to a section
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-1.5">
        {MECHANICS_RUNTIME_QUICK_LINKS.map((link) => {
          const active = activeSectionId === link.id;
          const count = counts[link.key];

          return (
            <button
              key={link.id}
              type="button"
              onClick={() => navigate(link.id)}
              className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left text-xs transition ${
                active
                  ? "border-[var(--muted-gold)]/45 bg-[var(--muted-gold)]/10 text-[var(--foreground)]"
                  : "border-transparent text-[var(--muted)] hover:border-white/10 hover:bg-white/[0.025] hover:text-[var(--foreground)]"
              }`}
            >
              <span>{link.label}</span>

              {count !== null ? (
                <span className="rounded-full border border-white/10 bg-black/30 px-2 py-0.5 text-[10px] text-[var(--muted)]">
                  {count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/10 pt-4">
        <button
          type="button"
          onClick={() => setAllExpanded(false)}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-[var(--muted)] transition hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)]"
        >
          <ChevronsUp size={13} />
          Collapse
        </button>

        <button
          type="button"
          onClick={() => setAllExpanded(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-[var(--muted)] transition hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)]"
        >
          <ChevronsDown size={13} />
          Expand
        </button>
      </div>
    </nav>
  );
}
