"use client";

import { useMemo, useState } from "react";
import { BookOpen, Search, Sparkles, Theater, Users, X } from "lucide-react";

const ICONS = {
  characters: Users,
  scenario: BookOpen,
  narrator: Theater,
  location: Sparkles,
  players: Users,
};

export default function RoomTemplatePackagePickerModalView({
  eyebrow = "Story Picker",
  title = "Select Reference",
  description = "Choose from your available Crestfall creations.",
  iconName = "characters",
  items = [],
  selectedIds = [],
  recommendedIds = [],
  searchPlaceholder = "Search...",
  emptyMessage = "No references found.",
  onClose = null,
  onChooseItem = null,
}) {
  const [query, setQuery] = useState("");
  const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const recommendedIdSet = useMemo(
    () => new Set(recommendedIds),
    [recommendedIds]
  );

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) return items;

    return items.filter((item) =>
      [item?.title, item?.subtitle, item?.type, item?.contentRating]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    );
  }, [items, query]);

  const Icon = ICONS[iconName] || Users;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--scrim-strong)] backdrop-blur-[2px] p-4">
      <section className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-4)] shadow-[var(--shadow-modal)]">
        <div className="flex items-start justify-between gap-3 border-b border-[var(--line-whisper)] py-3 px-4">
          <div>
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
              <Icon size={15} />
              {eyebrow}
            </p>

            <h2 className="mt-2 font-display text-4xl">{title}</h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--ink-dim)]">
              {description}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onClose?.()}
            className="flex h-[var(--control-md)] w-[var(--control-md)] items-center justify-center rounded-[var(--radius-full)] border border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--ink-dim)] transition hover:text-[var(--ink)]"
            aria-label="Close picker"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] px-4 py-3">
            <Search size={16} className="text-[var(--gold-ornament)]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-dim)]"
            />
          </div>

          <div className="mt-5 grid max-h-[62vh] gap-4 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.length ? (
              filteredItems.map((item) => {
                const recommended = recommendedIdSet.has(item.id);
                const active = selectedIdSet.has(item.id);

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onChooseItem?.(item.id)}
                    className={`overflow-hidden rounded-[var(--radius-md)] border text-left transition hover:-translate-y-1 ${
                      active
                        ? "border-[var(--gold-ornament)]/65 bg-[var(--gold-ornament)]/15"
                        : "border-[var(--line)] bg-[var(--surface-2)] hover:border-[var(--gold-ornament)]/35"
                    }`}
                  >
                    <div className="aspect-[3/4] overflow-hidden bg-gradient-to-br from-black via-black/80 to-[var(--gold-ornament)]/10">
                      {item.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.imageUrl}
                          alt={item.title || "Picker option"}
                          className="h-full w-full object-cover opacity-90"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center p-4 text-center text-xs text-[var(--ink-dim)]">
                          Image preview unavailable
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <p className="font-display text-2xl leading-none text-[var(--ink)]">
                        {item.title || "Untitled Reference"}
                      </p>

                      {item.subtitle ? (
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-[var(--ink-dim)]">
                          {item.subtitle}
                        </p>
                      ) : null}

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {item.contentRating ? (
                          <span className="inline-flex h-[var(--space-6)] items-center rounded-[var(--radius-full)] bg-[var(--tag-bed-canvas)] px-[var(--space-3)] text-[length:var(--text-label)] font-medium uppercase leading-[var(--lh-label)] tracking-[var(--track-label)] text-[var(--ink-dim)]">
                            {item.contentRating}
                          </span>
                        ) : null}
                        {recommended ? (
                          <span className="inline-flex h-[var(--space-6)] items-center rounded-[var(--radius-full)] bg-[var(--tag-bed-canvas)] px-[var(--space-3)] text-[length:var(--text-label)] font-medium uppercase leading-[var(--lh-label)] tracking-[var(--track-label)] text-[var(--gold-bright)]">
                            Recommended
                          </span>
                        ) : null}
                        {active ? (
                          <span className="inline-flex h-[var(--space-6)] items-center rounded-[var(--radius-full)] bg-[var(--tag-bed-canvas)] px-[var(--space-3)] text-[length:var(--text-label)] font-medium uppercase leading-[var(--lh-label)] tracking-[var(--track-label)] text-[var(--gold-bright)]">
                            Selected
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--line)] bg-[var(--surface-2)] p-8 text-center sm:col-span-2 lg:col-span-3 xl:col-span-4">
                <p className="text-sm leading-6 text-[var(--ink-dim)]">
                  {emptyMessage}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
