import { BookOpen, Search, Sparkles, Theater, Users, X } from "lucide-react";

import CreationPickerPanel from "@/components/studio/creations/pickers/CreationPickerPanel";

const ICONS = {
  characters: Users,
  scenario: BookOpen,
  narrator: Theater,
  location: Sparkles,
  reference: Search,
};

export default function RoomTemplatePickerModalView({
  eyebrow = "Story Picker",
  title = "Select Reference",
  description = "Choose a Story reference.",
  iconName = "reference",
  items = [],
  selectedIds = [],
  recommendedIds = [],
  searchPlaceholder = "Search references...",
  emptyMessage = "No references found.",
  onClose = null,
  onChooseItem = null,
}) {
  const Icon = ICONS[iconName] || Search;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <section className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[var(--radius-lg)] border border-[var(--muted-gold)]/25 bg-[#080706] shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
              <Icon size={15} />
              {eyebrow}
            </p>

            <h2 className="mt-2 font-display text-4xl">{title}</h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
              {description}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onClose?.()}
            className="rounded-lg border border-white/10 p-2 text-[var(--muted)] transition hover:text-[var(--foreground)]"
            aria-label="Close picker"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          <CreationPickerPanel
            items={items}
            selectedIds={selectedIds}
            recommendedIds={recommendedIds}
            searchPlaceholder={searchPlaceholder}
            emptyMessage={emptyMessage}
            gridClassName="max-h-[62vh] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            onSelect={(item) => onChooseItem?.(item?.id)}
          />
        </div>
      </section>
    </div>
  );
}
