"use client";

import { useEffect, useState } from "react";
import TimelineCard from "@/components/TimelineCard";

const STORAGE_KEY = "crestfall:lore-open-arcs";

export default function LoreArcAccordion({ arcGroups }) {
  const [openArcIds, setOpenArcIds] = useState(() => {
    if (typeof window === "undefined") return [];

    try {
      const saved = window.localStorage.getItem("crestfall-open-arc-ids");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  function handleToggle(groupId, isOpen) {
    setOpenArcIds((current) => {
      const next = isOpen
        ? Array.from(new Set([...current, groupId]))
        : current.filter((id) => id !== groupId);

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

      return next;
    });
  }

  return (
    <div className="relative mt-16">
      <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-transparent via-[var(--muted-gold)] to-transparent opacity-60 md:left-1/2" />

      <div className="mt-16 space-y-8">
        {arcGroups.map((group) => (
          <details
            key={group.id}
            open={openArcIds.includes(group.id)}
            onToggle={(event) =>
              handleToggle(group.id, event.currentTarget.open)
            }
            className="border border-[var(--line-strong)] bg-[rgba(5,5,4,0.55)]"
          >
            <summary className="cursor-pointer px-6 py-5 font-display text-xl tracking-[0.12em] text-[var(--muted-gold)]">
              {group.label}
            </summary>

            <div className="relative px-6 pb-8">
              <div className="absolute left-10 top-0 h-full w-px bg-gradient-to-b from-transparent via-[var(--muted-gold)] to-transparent opacity-60 md:left-1/2" />

              <div className="grid gap-10 md:grid-cols-2">
                {group.entries.map((entry) => (
                  <TimelineCard key={entry.slug} entry={entry} />
                ))}
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}