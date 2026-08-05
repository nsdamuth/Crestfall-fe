"use client";

import React from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BookImage,
  BookOpenText,
  Braces,
  ChevronDown,
  ChevronRight,
  Heart,
  Image as ImageIcon,
  MapPin,
  Plus,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";


function Field({ label, children, detail = "" }) {
  return (
    <label className="block">
      <span className="flex items-end justify-between gap-2 text-xs uppercase tracking-[0.17em] text-[var(--muted-gold)]">
        <span>{label}</span>
        {detail ? (
          <span className="normal-case tracking-normal text-[var(--muted)]">
            {detail}
          </span>
        ) : null}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--muted-gold)]/50";

function ReferenceSelector({
  ownedItems = [],
  likedItems = [],
  selectedRefs = [],
  onToggle,
  ownedStatus = "idle",
  likedStatus = "idle",
  ownedMessage = "",
  likedMessage = "",
  maxSelections = 5,
  singularLabel = "Character",
  pluralLabel = "Characters",
  Icon = Users,
}) {
  const [source, setSource] = React.useState("OWNED");
  const [query, setQuery] = React.useState("");
  const [focused, setFocused] = React.useState(false);

  const selectedIds = React.useMemo(
    () => new Set(selectedRefs.map((ref) => ref.id)),
    [selectedRefs]
  );
  const activeItems = source === "LIKED" ? likedItems : ownedItems;
  const activeStatus = source === "LIKED" ? likedStatus : ownedStatus;
  const activeMessage = source === "LIKED" ? likedMessage : ownedMessage;
  const normalizedQuery = query.trim().toLowerCase();
  const filteredItems = React.useMemo(() => {
    return activeItems
      .filter((item) => !selectedIds.has(item.id))
      .filter((item) => {
        if (!normalizedQuery) return true;
        return [item.title, item.handle, item.username]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      })
      .sort((left, right) => {
        const leftTitle = String(left.title || "").toLowerCase();
        const rightTitle = String(right.title || "").toLowerCase();
        const leftStarts = normalizedQuery && leftTitle.startsWith(normalizedQuery);
        const rightStarts = normalizedQuery && rightTitle.startsWith(normalizedQuery);
        if (leftStarts !== rightStarts) return leftStarts ? -1 : 1;
        return leftTitle.localeCompare(rightTitle);
      })
      .slice(0, 8);
  }, [activeItems, normalizedQuery, selectedIds]);

  const atLimit = selectedRefs.length >= maxSelections;
  const showResults = focused && !atLimit;

  function selectItem(item) {
    if (atLimit || selectedIds.has(item.id)) return;
    onToggle?.(item);
    setQuery("");
  }

  return (
    <div className="mt-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-lg border border-white/10 bg-black/35 p-1">
          <button
            type="button"
            onClick={() => {
              setSource("OWNED");
              setQuery("");
            }}
            className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs uppercase tracking-[0.13em] transition ${
              source === "OWNED"
                ? "bg-[var(--muted-gold)]/15 text-[var(--muted-gold)]"
                : "text-[var(--muted)] hover:text-white"
            }`}
          >
            <Icon size={13} /> Owned
          </button>
          <button
            type="button"
            onClick={() => {
              setSource("LIKED");
              setQuery("");
            }}
            className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs uppercase tracking-[0.13em] transition ${
              source === "LIKED"
                ? "bg-[var(--muted-gold)]/15 text-[var(--muted-gold)]"
                : "text-[var(--muted)] hover:text-white"
            }`}
          >
            <Heart size={13} /> Liked
          </button>
        </div>
        <p className="text-xs text-[var(--muted)]">
          {selectedRefs.length} / {maxSelections} selected
        </p>
      </div>

      {selectedRefs.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedRefs.map((item) => (
            <span
              key={item.id}
              className="inline-flex max-w-full items-center gap-2 rounded-full border border-[var(--muted-gold)]/30 bg-[var(--muted-gold)]/10 py-1.5 pl-2 pr-2.5 text-xs text-[var(--foreground)]"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-black/40">
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Icon size={11} className="text-[var(--muted-gold)]" />
                )}
              </span>
              <span className="max-w-52 truncate">{item.title}</span>
              <button
                type="button"
                onClick={() => onToggle?.(item)}
                className="rounded-full p-0.5 text-[var(--muted)] transition hover:bg-white/10 hover:text-white"
                aria-label={`Remove ${item.title}`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-3">
        <div className="relative">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
          />
          <input
            className={`${inputClass} mt-0`}
            style={{ paddingLeft: "2.75rem" }}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => window.setTimeout(() => setFocused(false), 120)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && filteredItems[0]) {
                event.preventDefault();
                selectItem(filteredItems[0]);
              }
            }}
            disabled={atLimit}
            placeholder={
              atLimit
                ? `Maximum of ${maxSelections} ${pluralLabel} selected`
                : `Search ${source === "LIKED" ? "liked" : "owned"} ${pluralLabel}…`
            }
            autoComplete="off"
          />
        </div>

        {showResults ? (
          <div className="mt-2 max-h-80 w-full overflow-y-auto rounded-xl border border-white/10 bg-[#090806] p-2 shadow-2xl">
            {activeStatus === "loading" ? (
              <p className="px-3 py-3 text-sm text-[var(--muted)]">
                Loading {source === "LIKED" ? "liked" : "owned"} {pluralLabel}…
              </p>
            ) : null}
            {activeMessage ? (
              <p className="px-3 py-3 text-sm text-red-200">{activeMessage}</p>
            ) : null}
            {activeStatus !== "loading" && !activeMessage && !filteredItems.length ? (
              <p className="px-3 py-3 text-sm leading-6 text-[var(--muted)]">
                {normalizedQuery
                  ? `No matching ${pluralLabel} found.`
                  : source === "LIKED"
                    ? `No liked public ${pluralLabel} are available.`
                    : `No owned ${pluralLabel} are available.`}
              </p>
            ) : null}
            {filteredItems.map((item) => (
              <button
                type="button"
                key={item.id}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectItem(item)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-white/5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-black/40">
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.imageUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Icon size={14} className="text-[var(--muted-gold)]" />
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm text-[var(--foreground)]">
                    {item.title}
                  </span>
                  <span className="mt-0.5 block text-[10px] uppercase tracking-[0.13em] text-[var(--muted)]">
                    Add {singularLabel}
                  </span>
                </span>
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {atLimit ? (
        <p className="mt-2 text-xs text-[var(--muted)]">
          Remove a selected {singularLabel} before adding another.
        </p>
      ) : null}
    </div>
  );
}

function ColumnBlockCard({
  block,
  blockIndex,
  blockCount,
  parentBlock,
  columnIndex,
  chapterId,
  sectionId,
  imageSizeOptions,
  imageAlignOptions,
  onUpdateColumnBlock,
  onRemoveColumnBlock,
  onMoveColumnBlock,
  onOpenImagePicker,
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--muted-gold)]">
          {block.type === "image"
            ? "Character Image"
            : block.type === "inline-quote"
              ? "Inline Quote"
              : block.type === "divider"
                ? "Divider"
                : "Body Text"}
        </p>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() =>
              onMoveColumnBlock?.(
                chapterId,
                sectionId,
                parentBlock.id,
                columnIndex,
                block.id,
                -1
              )
            }
            disabled={blockIndex === 0}
            className="rounded-md border border-white/10 p-1.5 text-[var(--muted)] disabled:opacity-30"
            aria-label="Move column block up"
          >
            <ArrowUp size={12} />
          </button>
          <button
            type="button"
            onClick={() =>
              onMoveColumnBlock?.(
                chapterId,
                sectionId,
                parentBlock.id,
                columnIndex,
                block.id,
                1
              )
            }
            disabled={blockIndex === blockCount - 1}
            className="rounded-md border border-white/10 p-1.5 text-[var(--muted)] disabled:opacity-30"
            aria-label="Move column block down"
          >
            <ArrowDown size={12} />
          </button>
          <button
            type="button"
            onClick={() =>
              onRemoveColumnBlock?.(
                chapterId,
                sectionId,
                parentBlock.id,
                columnIndex,
                block.id
              )
            }
            className="rounded-md border border-white/10 p-1.5 text-[var(--status-danger)]"
            aria-label="Remove column block"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
      <BlockFields
        block={block}
        chapterId={chapterId}
        sectionId={sectionId}
        imageSizeOptions={imageSizeOptions}
        imageAlignOptions={imageAlignOptions}
        onUpdate={(_chapterId, _sectionId, _blockId, field, nextValue) =>
          onUpdateColumnBlock?.(
            chapterId,
            sectionId,
            parentBlock.id,
            columnIndex,
            block.id,
            field,
            nextValue
          )
        }
        onOpenImagePicker={() =>
          onOpenImagePicker?.(
            chapterId,
            sectionId,
            parentBlock.id,
            columnIndex,
            block.id
          )
        }
      />
    </div>
  );
}

function BlockFields({
  block,
  chapterId,
  sectionId,
  imageSizeOptions,
  imageAlignOptions,
  columnBlockTypes = [],
  limits = {},
  onUpdate,
  onOpenImagePicker,
  onAddStatItem,
  onUpdateStatItem,
  onRemoveStatItem,
  onMoveStatItem,
  onAddColumnBlock,
  onUpdateColumnBlock,
  onRemoveColumnBlock,
  onMoveColumnBlock,
}) {
  if (block.type === "divider") {
    return (
      <p className="text-sm text-[var(--muted)]">
        A decorative sourcebook divider will appear here.
      </p>
    );
  }

  if (block.type === "text") {
    return (
      <div className="grid gap-4">
        <Field label="Optional heading">
          <input
            className={inputClass}
            value={block.title}
            onChange={(event) =>
              onUpdate?.(chapterId, sectionId, block.id, "title", event.target.value)
            }
          />
        </Field>
        <Field label="Body text">
          <textarea
            className={`${inputClass} min-h-40 resize-y leading-7`}
            value={block.body}
            onChange={(event) =>
              onUpdate?.(chapterId, sectionId, block.id, "body", event.target.value)
            }
          />
        </Field>
        <div className="flex flex-wrap gap-4 text-sm text-[var(--muted)]">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={block.dropCap}
              onChange={(event) =>
                onUpdate?.(
                  chapterId,
                  sectionId,
                  block.id,
                  "dropCap",
                  event.target.checked
                )
              }
            />
            Drop cap
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={block.indent}
              onChange={(event) =>
                onUpdate?.(
                  chapterId,
                  sectionId,
                  block.id,
                  "indent",
                  event.target.checked
                )
              }
            />
            Paragraph indent
          </label>
        </div>
      </div>
    );
  }

  if (block.type === "heading") {
    return (
      <div className="grid gap-4 sm:grid-cols-[1fr_180px]">
        <Field label="Heading">
          <input
            className={inputClass}
            value={block.text}
            onChange={(event) =>
              onUpdate?.(chapterId, sectionId, block.id, "text", event.target.value)
            }
          />
        </Field>
        <Field label="Level">
          <select
            className={inputClass}
            value={block.level}
            onChange={(event) =>
              onUpdate?.(
                chapterId,
                sectionId,
                block.id,
                "level",
                Number(event.target.value)
              )
            }
          >
            <option value={2}>Section heading</option>
            <option value={3}>Subheading</option>
          </select>
        </Field>
      </div>
    );
  }

  if (["quote", "inline-quote", "pull-quote"].includes(block.type)) {
    const quoteLabel =
      block.type === "inline-quote"
        ? "Inline quote"
        : block.type === "pull-quote"
          ? "Pull quote"
          : "Quote";

    return (
      <div className="grid gap-4">
        <Field label={quoteLabel}>
          <textarea
            className={`${inputClass} min-h-28 resize-y`}
            value={block.text}
            onChange={(event) =>
              onUpdate?.(chapterId, sectionId, block.id, "text", event.target.value)
            }
          />
        </Field>
        <Field label="Attribution">
          <input
            className={inputClass}
            value={block.attribution}
            onChange={(event) =>
              onUpdate?.(
                chapterId,
                sectionId,
                block.id,
                "attribution",
                event.target.value
              )
            }
          />
        </Field>
      </div>
    );
  }

  if (block.type === "excerpt") {
    return (
      <div className="grid gap-4">
        <Field label="Excerpt title">
          <input
            className={inputClass}
            value={block.title}
            onChange={(event) =>
              onUpdate?.(chapterId, sectionId, block.id, "title", event.target.value)
            }
          />
        </Field>
        <Field label="Excerpt body">
          <textarea
            className={`${inputClass} min-h-32 resize-y leading-7`}
            value={block.body}
            onChange={(event) =>
              onUpdate?.(chapterId, sectionId, block.id, "body", event.target.value)
            }
          />
        </Field>
      </div>
    );
  }

  if (block.type === "story-excerpt") {
    return (
      <div className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Excerpt label">
            <input
              className={inputClass}
              value={block.title}
              onChange={(event) =>
                onUpdate?.(
                  chapterId,
                  sectionId,
                  block.id,
                  "title",
                  event.target.value
                )
              }
              placeholder="Recovered Fragment"
            />
          </Field>
          <Field label="Excerpt title">
            <input
              className={inputClass}
              value={block.subtitle}
              onChange={(event) =>
                onUpdate?.(
                  chapterId,
                  sectionId,
                  block.id,
                  "subtitle",
                  event.target.value
                )
              }
            />
          </Field>
        </div>
        <Field label="Story excerpt">
          <textarea
            className={`${inputClass} min-h-40 resize-y leading-7`}
            value={block.body}
            onChange={(event) =>
              onUpdate?.(chapterId, sectionId, block.id, "body", event.target.value)
            }
          />
        </Field>
        <Field label="Attribution">
          <input
            className={inputClass}
            value={block.attribution}
            onChange={(event) =>
              onUpdate?.(
                chapterId,
                sectionId,
                block.id,
                "attribution",
                event.target.value
              )
            }
          />
        </Field>
      </div>
    );
  }

  if (block.type === "sidebar") {
    return (
      <div className="grid gap-4">
        <Field label="Sidebar title">
          <input
            className={inputClass}
            value={block.title}
            onChange={(event) =>
              onUpdate?.(chapterId, sectionId, block.id, "title", event.target.value)
            }
          />
        </Field>
        <Field label="Optional introduction">
          <textarea
            className={`${inputClass} min-h-24 resize-y leading-7`}
            value={block.body}
            onChange={(event) =>
              onUpdate?.(chapterId, sectionId, block.id, "body", event.target.value)
            }
          />
        </Field>
        <Field label="List items" detail="One item per line">
          <textarea
            className={`${inputClass} min-h-36 resize-y leading-7`}
            value={(block.items || []).join("\n")}
            onChange={(event) =>
              onUpdate?.(
                chapterId,
                sectionId,
                block.id,
                "items",
                event.target.value.split("\n")
              )
            }
          />
        </Field>
      </div>
    );
  }

  if (block.type === "stat-block") {
    return (
      <div className="grid gap-4">
        <Field label="Reference block title">
          <input
            className={inputClass}
            value={block.title}
            onChange={(event) =>
              onUpdate?.(chapterId, sectionId, block.id, "title", event.target.value)
            }
          />
        </Field>

        <div className="grid gap-3">
          {(block.items || []).map((item, itemIndex) => (
            <div
              key={item.id}
              className="grid gap-3 rounded-xl border border-white/10 bg-black/25 p-3 md:grid-cols-[0.42fr_1fr_auto]"
            >
              <Field label="Label">
                <input
                  className={inputClass}
                  value={item.label}
                  onChange={(event) =>
                    onUpdateStatItem?.(
                      chapterId,
                      sectionId,
                      block.id,
                      item.id,
                      "label",
                      event.target.value
                    )
                  }
                />
              </Field>
              <Field label="Value">
                <textarea
                  className={`${inputClass} min-h-20 resize-y`}
                  value={item.value}
                  onChange={(event) =>
                    onUpdateStatItem?.(
                      chapterId,
                      sectionId,
                      block.id,
                      item.id,
                      "value",
                      event.target.value
                    )
                  }
                />
              </Field>
              <div className="flex items-end gap-1.5 pb-0.5">
                <button
                  type="button"
                  onClick={() =>
                    onMoveStatItem?.(
                      chapterId,
                      sectionId,
                      block.id,
                      item.id,
                      -1
                    )
                  }
                  disabled={itemIndex === 0}
                  className="rounded-lg border border-white/10 p-2 text-[var(--muted)] disabled:opacity-30"
                  aria-label="Move reference row up"
                >
                  <ArrowUp size={13} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onMoveStatItem?.(
                      chapterId,
                      sectionId,
                      block.id,
                      item.id,
                      1
                    )
                  }
                  disabled={itemIndex === block.items.length - 1}
                  className="rounded-lg border border-white/10 p-2 text-[var(--muted)] disabled:opacity-30"
                  aria-label="Move reference row down"
                >
                  <ArrowDown size={13} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onRemoveStatItem?.(
                      chapterId,
                      sectionId,
                      block.id,
                      item.id
                    )
                  }
                  className="rounded-lg border border-white/10 p-2 text-[var(--status-danger)]"
                  aria-label="Remove reference row"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onAddStatItem?.(chapterId, sectionId, block.id)}
          disabled={(block.items || []).length >= (limits.maxStatItems || 32)}
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs text-[var(--muted)] transition hover:border-[var(--muted-gold)]/35 hover:text-white disabled:opacity-40"
        >
          <Plus size={13} /> Add reference row
        </button>
      </div>
    );
  }

  if (block.type === "two-column") {
    return (
      <div className="grid gap-4">
        <p className="text-sm leading-6 text-[var(--muted)]">
          Columns stack on smaller screens. Each column supports body text,
          Character images, inline quotes, and dividers.
        </p>
        <div className="grid gap-4 xl:grid-cols-2">
          {(block.columns || []).map((column, columnIndex) => (
            <section
              key={column.id}
              className="rounded-xl border border-[var(--muted-gold)]/20 bg-black/20 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
                  Column {columnIndex + 1}
                </p>
                <span className="text-xs text-[var(--muted)]">
                  {column.blocks.length} / {limits.maxBlocksPerColumn || 64}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {columnBlockTypes.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      onAddColumnBlock?.(
                        chapterId,
                        sectionId,
                        block.id,
                        columnIndex,
                        option.value
                      )
                    }
                    disabled={
                      column.blocks.length >= (limits.maxBlocksPerColumn || 64)
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/30 px-2.5 py-2 text-[10px] uppercase tracking-[0.1em] text-[var(--muted)] transition hover:border-[var(--muted-gold)]/35 hover:text-white disabled:opacity-40"
                  >
                    <Plus size={12} /> {option.label}
                  </button>
                ))}
              </div>

              <div className="mt-4 space-y-3">
                {column.blocks.map((columnBlock, columnBlockIndex) => (
                  <ColumnBlockCard
                    key={columnBlock.id}
                    block={columnBlock}
                    blockIndex={columnBlockIndex}
                    blockCount={column.blocks.length}
                    parentBlock={block}
                    columnIndex={columnIndex}
                    chapterId={chapterId}
                    sectionId={sectionId}
                    imageSizeOptions={imageSizeOptions}
                    imageAlignOptions={imageAlignOptions}
                    onUpdateColumnBlock={onUpdateColumnBlock}
                    onRemoveColumnBlock={onRemoveColumnBlock}
                    onMoveColumnBlock={onMoveColumnBlock}
                    onOpenImagePicker={onOpenImagePicker}
                  />
                ))}
                {!column.blocks.length ? (
                  <p className="rounded-lg border border-dashed border-white/10 p-4 text-center text-xs text-[var(--muted)]">
                    Add a block to this column.
                  </p>
                ) : null}
              </div>
            </section>
          ))}
        </div>
      </div>
    );
  }

  if (block.type === "callout") {
    return (
      <div className="grid gap-4">
        <Field label="Callout title">
          <input
            className={inputClass}
            value={block.title}
            onChange={(event) =>
              onUpdate?.(chapterId, sectionId, block.id, "title", event.target.value)
            }
          />
        </Field>
        <Field label="Callout body">
          <textarea
            className={`${inputClass} min-h-28 resize-y`}
            value={block.body}
            onChange={(event) =>
              onUpdate?.(chapterId, sectionId, block.id, "body", event.target.value)
            }
          />
        </Field>
      </div>
    );
  }

  if (block.type === "image") {
    return (
      <div className="grid gap-4">
        <button
          type="button"
          onClick={() => onOpenImagePicker?.(chapterId, sectionId, block.id)}
          className="flex min-h-36 items-center justify-center overflow-hidden rounded-xl border border-dashed border-[var(--muted-gold)]/35 bg-black/25 text-sm text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/10"
        >
          {block.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={block.src}
              alt={block.alt || "Selected lore image"}
              className="max-h-72 w-full object-contain"
            />
          ) : (
            <span className="inline-flex items-center gap-2">
              <ImageIcon size={18} /> Select from an owned tagged Character library
            </span>
          )}
        </button>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Alt text">
            <input
              className={inputClass}
              value={block.alt}
              onChange={(event) =>
                onUpdate?.(chapterId, sectionId, block.id, "alt", event.target.value)
              }
            />
          </Field>
          <Field label="Caption">
            <input
              className={inputClass}
              value={block.caption}
              onChange={(event) =>
                onUpdate?.(
                  chapterId,
                  sectionId,
                  block.id,
                  "caption",
                  event.target.value
                )
              }
            />
          </Field>
          <Field label="Size">
            <select
              className={inputClass}
              value={block.size}
              onChange={(event) =>
                onUpdate?.(chapterId, sectionId, block.id, "size", event.target.value)
              }
            >
              {imageSizeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Alignment">
            <select
              className={inputClass}
              value={block.align}
              onChange={(event) =>
                onUpdate?.(chapterId, sectionId, block.id, "align", event.target.value)
              }
            >
              {imageAlignOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </div>
    );
  }

  return null;
}

function BlockPickerModal({ picker, blockTypes = [], onClose, onChooseBlock }) {
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    if (picker) setQuery("");
  }, [picker]);

  if (!picker) return null;

  const normalizedQuery = query.trim().toLowerCase();
  const filteredTypes = blockTypes.filter((option) => {
    if (!normalizedQuery) return true;
    return [option.label, option.category, option.description]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery);
  });
  const categories = [...new Set(filteredTypes.map((option) => option.category || "Other"))];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--scrim-strong)] p-4 backdrop-blur-[var(--blur-panel)]"
      role="dialog"
      aria-modal="true"
      aria-label="Add content block"
    >
      <div
        className="isolate max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[var(--radius-md)] border border-[var(--muted-gold)]/30 p-5 shadow-2xl"
        style={{ backgroundColor: "#100d09" }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
              Lore Block Library
            </p>
            <h3 className="mt-2 font-display text-3xl">Add content block</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
              Choose the kind of content to append to this section. Each option includes
              a short description of how it appears in Preview and on the public page.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 p-2 text-[var(--muted)] hover:text-white"
            aria-label="Close block library"
          >
            <X size={18} />
          </button>
        </div>

        <div className="relative mt-5">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
          />
          <input
            className={`${inputClass} mt-0`}
            style={{ paddingLeft: "2.75rem" }}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search block types…"
            autoFocus
            autoComplete="off"
          />
        </div>

        {categories.length ? (
          <div className="mt-6 grid gap-7">
            {categories.map((category, categoryIndex) => (
              <section key={category} className="min-w-0">
                {categoryIndex > 0 ? (
                  <div
                    className="mb-6 border-t border-white/10"
                    aria-hidden="true"
                  />
                ) : null}
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
                  {category}
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {filteredTypes
                    .filter((option) => (option.category || "Other") === category)
                    .map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => onChooseBlock?.(option.value)}
                        className="rounded-xl border border-white/10 bg-black/30 p-4 text-left transition hover:border-[var(--muted-gold)]/45 hover:bg-[var(--muted-gold)]/5"
                      >
                        <span className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                          <Plus size={14} className="text-[var(--muted-gold)]" />
                          {option.label}
                        </span>
                        <span className="mt-2 block text-xs leading-5 text-[var(--muted)]">
                          {option.description || "Add this block to the current section."}
                        </span>
                      </button>
                    ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-[var(--muted)]">
            No block types match that search.
          </div>
        )}
      </div>
    </div>
  );
}

function ImagePickerModal({
  picker,
  status,
  message,
  images,
  onClose,
  onSelectCharacter,
  onChooseImage,
}) {
  if (!picker) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-[var(--radius-md)] border border-[var(--muted-gold)]/30 bg-[#100d09] p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
              Character Image Library
            </p>
            <h3 className="mt-2 font-display text-3xl">Select lore image</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 p-2 text-[var(--muted)] hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {!picker.eligibleCharacters.length ? (
          <div className="mt-5 rounded-xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
            Tag an owned Character on the Lore Asset, chapter, or section before
            selecting an image.
          </div>
        ) : (
          <div className="mt-5 flex flex-wrap gap-2">
            {picker.eligibleCharacters.map((character) => (
              <button
                key={character.id}
                type="button"
                onClick={() => onSelectCharacter?.(character.id)}
                className={`rounded-[var(--radius-md)] border px-4 py-2 text-xs uppercase tracking-[0.15em] ${
                  picker.selectedCharacterId === character.id
                    ? "border-[var(--muted-gold)]/60 bg-[var(--muted-gold)]/15 text-white"
                    : "border-white/10 text-[var(--muted)]"
                }`}
              >
                {character.title}
              </button>
            ))}
          </div>
        )}

        {status === "loading" ? (
          <p className="mt-6 text-sm text-[var(--muted)]">Loading eligible images…</p>
        ) : null}
        {message ? <p className="mt-6 text-sm text-red-200">{message}</p> : null}
        {status === "loaded" && !images.length ? (
          <p className="mt-6 text-sm text-[var(--muted)]">
            No visible, approved images are available for this Character.
          </p>
        ) : null}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {images.map((image) => (
            <button
              key={image.id}
              type="button"
              onClick={() => onChooseImage?.(image)}
              className="overflow-hidden rounded-xl border border-white/10 bg-black/30 text-left transition hover:border-[var(--muted-gold)]/45"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.displayImageUrl}
                alt={image.title || "Character library image"}
                className="aspect-[3/4] w-full object-cover"
              />
              <p className="truncate px-3 py-2 text-xs text-[var(--muted)]">
                {image.title || "Select image"}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LoreEditorView({
  document,
  ownedCharacters = [],
  likedCharacters = [],
  ownedCharacterLoadStatus = "idle",
  likedCharacterLoadStatus = "idle",
  ownedCharacterLoadMessage = "",
  likedCharacterLoadMessage = "",
  ownedLocations = [],
  likedLocations = [],
  ownedLocationLoadStatus = "idle",
  likedLocationLoadStatus = "idle",
  ownedLocationLoadMessage = "",
  likedLocationLoadMessage = "",
  expandedChapterId = "",
  expandedSectionId = "",
  blockTypes = [],
  columnBlockTypes = [],
  imageSizeOptions = [],
  imageAlignOptions = [],
  issues = [],
  chapterCount = 0,
  sectionCount = 0,
  blockCount = 0,
  limits = {},
  imagePicker = null,
  imageLibraryStatus = "idle",
  imageLibraryMessage = "",
  imageLibraryImages = [],
  jsonEditorSlot = null,
  onOpenJsonEditor,
  onUpdateDocumentField,
  onToggleDocumentCharacter,
  onToggleDocumentLocation,
  onSetExpandedChapter,
  onSetExpandedSection,
  onAddChapter,
  onRemoveChapter,
  onMoveChapter,
  onUpdateChapterField,
  onToggleChapterCharacter,
  onToggleChapterLocation,
  onAddSection,
  onRemoveSection,
  onMoveSection,
  onUpdateSectionField,
  onToggleSectionCharacter,
  onToggleSectionLocation,
  onAddBlock,
  onUpdateBlock,
  onRemoveBlock,
  onMoveBlock,
  onAddStatItem,
  onUpdateStatItem,
  onRemoveStatItem,
  onMoveStatItem,
  onAddColumnBlock,
  onUpdateColumnBlock,
  onRemoveColumnBlock,
  onMoveColumnBlock,
  onOpenImagePicker,
  onCloseImagePicker,
  onSelectImageCharacter,
  onChooseImage,
}) {
  const errors = issues.filter((item) => item.severity !== "WARNING");
  const warnings = issues.filter((item) => item.severity === "WARNING");
  const [blockPicker, setBlockPicker] = React.useState(null);

  function openBlockPicker(chapterId, sectionId) {
    setBlockPicker({ chapterId, sectionId });
  }

  function chooseBlock(type) {
    if (!blockPicker) return;
    onAddBlock?.(blockPicker.chapterId, blockPicker.sectionId, type);
    setBlockPicker(null);
  }

  return (
    <section className="rounded-[var(--radius-md)] border border-[var(--muted-gold)]/25 bg-black/30 p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[var(--muted-gold)]">
            <BookOpenText size={18} />
            <p className="text-xs uppercase tracking-[0.22em]">Lore Document</p>
          </div>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">
            Chapters, sections & sourcebook blocks
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            Character and Location tags are structured relationships for presentation
            and future release workflows. Character tags also control image eligibility;
            neither tag type grants engine knowledge by itself.
          </p>
        </div>
        <div className="grid gap-3">
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            {[
              ["Chapters", chapterCount],
              ["Sections", sectionCount],
              ["Blocks", blockCount],
            ].map(([label, count]) => (
              <div
                key={label}
                className="rounded-xl border border-white/10 bg-black/25 px-3 py-3 sm:px-4"
              >
                <p className="text-[var(--muted-gold)]">{label}</p>
                <p className="mt-1 text-lg">{count}</p>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onOpenJsonEditor?.()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:border-[var(--muted-gold)]/55 hover:bg-[var(--muted-gold)]/15 hover:text-[var(--foreground)]"
          >
            <Braces size={14} />
            JSON Editor
          </button>
        </div>
      </div>

      {issues.length ? (
        <div className="mt-5 grid gap-2">
          {[...errors, ...warnings].slice(0, 8).map((item, index) => (
            <div
              key={`${item.code}-${index}`}
              className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-xs ${
                item.severity === "WARNING"
                  ? "border-amber-300/25 bg-amber-300/10 text-amber-100"
                  : "border-red-300/25 bg-red-300/10 text-red-100"
              }`}
            >
              <AlertTriangle size={14} className="mt-0.5 shrink-0" />
              <span>{item.message}</span>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <Field label="Publication subtitle">
          <input
            className={inputClass}
            value={document.subtitle}
            onChange={(event) =>
              onUpdateDocumentField?.("subtitle", event.target.value)
            }
            placeholder="A history, archive, or chronicle subtitle"
          />
        </Field>
        <Field label="Archive eyebrow">
          <input
            className={inputClass}
            value={document.eyebrow}
            onChange={(event) =>
              onUpdateDocumentField?.("eyebrow", event.target.value)
            }
          />
        </Field>
        <Field label="Era">
          <input
            className={inputClass}
            value={document.era}
            onChange={(event) => onUpdateDocumentField?.("era", event.target.value)}
            placeholder="Modern Era"
          />
        </Field>
        <Field label="Display date">
          <input
            className={inputClass}
            value={document.displayDate}
            onChange={(event) =>
              onUpdateDocumentField?.("displayDate", event.target.value)
            }
            placeholder="1994–1997"
          />
        </Field>
        <Field label="Realm">
          <input
            className={inputClass}
            value={document.realm}
            onChange={(event) => onUpdateDocumentField?.("realm", event.target.value)}
            placeholder="Crestfall"
          />
        </Field>
        <Field label="Publication summary">
          <textarea
            className={`${inputClass} min-h-28 resize-y`}
            value={document.summary}
            onChange={(event) =>
              onUpdateDocumentField?.("summary", event.target.value)
            }
          />
        </Field>
      </div>

      <div className="mt-7 border-t border-white/10" aria-hidden="true" />
      <div className="mt-6">
        <div className="flex items-center gap-2 text-[var(--muted-gold)]">
          <Users size={17} />
          <p className="text-xs uppercase tracking-[0.2em]">
            Asset-level Character Tags
          </p>
        </div>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          These Characters appear as related links. Owned tagged Characters also
          make their eligible image libraries available to every chapter and section.
        </p>
        <ReferenceSelector
          ownedItems={ownedCharacters}
          likedItems={likedCharacters}
          selectedRefs={document.characterRefs}
          onToggle={onToggleDocumentCharacter}
          ownedStatus={ownedCharacterLoadStatus}
          likedStatus={likedCharacterLoadStatus}
          ownedMessage={ownedCharacterLoadMessage}
          likedMessage={likedCharacterLoadMessage}
          maxSelections={limits.maxDocumentCharacterRefs}
          singularLabel="Character"
          pluralLabel="Characters"
          Icon={Users}
        />

        <div className="mt-6 rounded-xl border border-white/10 bg-black/20 p-4">
          <div className="flex items-center gap-2 text-[var(--muted-gold)]">
            <MapPin size={16} />
            <p className="text-xs uppercase tracking-[0.18em]">
              Asset-level Location Tags
            </p>
          </div>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            These Locations are associated with the entire Lore Asset and appear as
            related links in the reader.
          </p>
          <ReferenceSelector
            ownedItems={ownedLocations}
            likedItems={likedLocations}
            selectedRefs={document.locationRefs}
            onToggle={onToggleDocumentLocation}
            ownedStatus={ownedLocationLoadStatus}
            likedStatus={likedLocationLoadStatus}
            ownedMessage={ownedLocationLoadMessage}
            likedMessage={likedLocationLoadMessage}
            maxSelections={limits.maxDocumentLocationRefs}
            singularLabel="Location"
            pluralLabel="Locations"
            Icon={MapPin}
          />
        </div>
      </div>

      <div className="mt-8 border-t border-white/10" aria-hidden="true" />
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Chapters
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Stable chapter and section IDs keep public deep links durable while titles
            change.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddChapter}
          disabled={chapterCount >= limits.maxChapters}
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--muted-gold)]/40 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] transition hover:bg-[var(--muted-gold)]/15 disabled:opacity-40"
        >
          <Plus size={15} /> Add Chapter
        </button>
      </div>

      <div className="mt-5 space-y-4">
        {document.chapters.map((chapter, chapterIndex) => {
          const expanded = expandedChapterId === chapter.id;
          const ToggleIcon = expanded ? ChevronDown : ChevronRight;
          const chapterBlockCount = chapter.sections.reduce(
            (total, section) => total + section.blocks.length,
            0
          );

          return (
            <article
              key={chapter.id}
              className="overflow-hidden rounded-xl border border-white/10 bg-black/25"
            >
              <div className="flex items-center gap-2 p-3 sm:p-4">
                <button
                  type="button"
                  onClick={() => onSetExpandedChapter?.(expanded ? "" : chapter.id)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <ToggleIcon
                    size={18}
                    className="shrink-0 text-[var(--muted-gold)]"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm text-white">
                      {chapter.title || "Untitled Chapter"}
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">
                      {chapter.sections.length} sections · {chapterBlockCount} blocks ·{" "}
                      {chapter.characterRefs.length} Character tags ·{" "}
                      {chapter.locationRefs.length} Location tags
                    </p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => onMoveChapter?.(chapter.id, -1)}
                  disabled={chapterIndex === 0}
                  className="rounded-lg border border-white/10 p-2 text-[var(--muted)] disabled:opacity-30"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => onMoveChapter?.(chapter.id, 1)}
                  disabled={chapterIndex === document.chapters.length - 1}
                  className="rounded-lg border border-white/10 p-2 text-[var(--muted)] disabled:opacity-30"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => onRemoveChapter?.(chapter.id)}
                  className="rounded-lg border border-white/10 p-2 text-[var(--status-danger)]"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {expanded ? (
                <div className="border-t border-white/10 p-4 sm:p-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Chapter title">
                      <input
                        className={inputClass}
                        value={chapter.title}
                        onChange={(event) =>
                          onUpdateChapterField?.(
                            chapter.id,
                            "title",
                            event.target.value
                          )
                        }
                      />
                    </Field>
                    <Field label="Chapter subtitle">
                      <input
                        className={inputClass}
                        value={chapter.subtitle}
                        onChange={(event) =>
                          onUpdateChapterField?.(
                            chapter.id,
                            "subtitle",
                            event.target.value
                          )
                        }
                      />
                    </Field>
                    <Field label="Chapter eyebrow">
                      <input
                        className={inputClass}
                        value={chapter.eyebrow}
                        onChange={(event) =>
                          onUpdateChapterField?.(
                            chapter.id,
                            "eyebrow",
                            event.target.value
                          )
                        }
                        placeholder={`Chapter ${chapterIndex + 1}`}
                      />
                    </Field>
                    <Field label="Display date">
                      <input
                        className={inputClass}
                        value={chapter.displayDate}
                        onChange={(event) =>
                          onUpdateChapterField?.(
                            chapter.id,
                            "displayDate",
                            event.target.value
                          )
                        }
                      />
                    </Field>
                    <Field label="Era">
                      <input
                        className={inputClass}
                        value={chapter.era}
                        onChange={(event) =>
                          onUpdateChapterField?.(
                            chapter.id,
                            "era",
                            event.target.value
                          )
                        }
                      />
                    </Field>
                    <Field label="Chapter summary">
                      <textarea
                        className={`${inputClass} min-h-28 resize-y`}
                        value={chapter.summary}
                        onChange={(event) =>
                          onUpdateChapterField?.(
                            chapter.id,
                            "summary",
                            event.target.value
                          )
                        }
                      />
                    </Field>
                  </div>

                  <div className="mt-6 rounded-xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
                      Chapter-only Character Tags
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                      These tags apply to every section in this chapter unless a
                      section adds more specific Character tags. Owned tags can also
                      supply Character-library images.
                    </p>
                    <ReferenceSelector
                      ownedItems={ownedCharacters}
                      likedItems={likedCharacters}
                      selectedRefs={chapter.characterRefs}
                      onToggle={(character) =>
                        onToggleChapterCharacter?.(chapter.id, character)
                      }
                      ownedStatus={ownedCharacterLoadStatus}
                      likedStatus={likedCharacterLoadStatus}
                      ownedMessage={ownedCharacterLoadMessage}
                      likedMessage={likedCharacterLoadMessage}
                      maxSelections={limits.maxChapterCharacterRefs}
                      singularLabel="Character"
                      pluralLabel="Characters"
                      Icon={Users}
                    />
                  </div>

                  <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center gap-2 text-[var(--muted-gold)]">
                      <MapPin size={15} />
                      <p className="text-xs uppercase tracking-[0.18em]">
                        Chapter-only Location Tags
                      </p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                      These Locations apply to this chapter. Sections can add more
                      specific Location relationships.
                    </p>
                    <ReferenceSelector
                      ownedItems={ownedLocations}
                      likedItems={likedLocations}
                      selectedRefs={chapter.locationRefs}
                      onToggle={(location) =>
                        onToggleChapterLocation?.(chapter.id, location)
                      }
                      ownedStatus={ownedLocationLoadStatus}
                      likedStatus={likedLocationLoadStatus}
                      ownedMessage={ownedLocationLoadMessage}
                      likedMessage={likedLocationLoadMessage}
                      maxSelections={limits.maxChapterLocationRefs}
                      singularLabel="Location"
                      pluralLabel="Locations"
                      Icon={MapPin}
                    />
                  </div>

                  <div
                    className="mt-7 border-t border-white/10"
                    aria-hidden="true"
                  />
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
                        Sections
                      </p>
                      <p className="mt-2 text-sm text-[var(--muted)]">
                        Sections are stable, addressable units for public links and
                        future certified engine retrieval.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onAddSection?.(chapter.id)}
                      disabled={
                        chapter.sections.length >= limits.maxSectionsPerChapter
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-3 py-2 text-xs uppercase tracking-[0.14em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/15 disabled:opacity-40"
                    >
                      <Plus size={13} /> Add Section
                    </button>
                  </div>

                  <div className="mt-4 space-y-4">
                    {chapter.sections.map((section, sectionIndex) => {
                      const sectionExpanded = expandedSectionId === section.id;
                      const SectionToggleIcon = sectionExpanded
                        ? ChevronDown
                        : ChevronRight;

                      return (
                        <section
                          key={section.id}
                          className="overflow-hidden rounded-xl border border-[var(--muted-gold)]/15 bg-black/30"
                        >
                          <div className="flex items-center gap-2 p-3 sm:p-4">
                            <button
                              type="button"
                              onClick={() =>
                                onSetExpandedSection?.(
                                  sectionExpanded ? "" : section.id
                                )
                              }
                              className="flex min-w-0 flex-1 items-center gap-3 text-left"
                            >
                              <SectionToggleIcon
                                size={16}
                                className="shrink-0 text-[var(--muted-gold)]"
                              />
                              <div className="min-w-0">
                                <p className="truncate text-sm text-white">
                                  {section.title || `Section ${sectionIndex + 1}`}
                                </p>
                                <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">
                                  {section.blocks.length} blocks ·{" "}
                                  {section.characterRefs.length} Character tags ·{" "}
                                  {section.locationRefs.length} Location tags
                                </p>
                              </div>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                onMoveSection?.(chapter.id, section.id, -1)
                              }
                              disabled={sectionIndex === 0}
                              className="rounded-lg border border-white/10 p-2 text-[var(--muted)] disabled:opacity-30"
                            >
                              <ArrowUp size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                onMoveSection?.(chapter.id, section.id, 1)
                              }
                              disabled={sectionIndex === chapter.sections.length - 1}
                              className="rounded-lg border border-white/10 p-2 text-[var(--muted)] disabled:opacity-30"
                            >
                              <ArrowDown size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                onRemoveSection?.(chapter.id, section.id)
                              }
                              className="rounded-lg border border-white/10 p-2 text-[var(--status-danger)]"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>

                          {sectionExpanded ? (
                            <div className="border-t border-white/10 p-4">
                              <div className="grid gap-4 md:grid-cols-2">
                                <Field label="Section title">
                                  <input
                                    className={inputClass}
                                    value={section.title}
                                    onChange={(event) =>
                                      onUpdateSectionField?.(
                                        chapter.id,
                                        section.id,
                                        "title",
                                        event.target.value
                                      )
                                    }
                                  />
                                </Field>
                                <Field label="Section subtitle">
                                  <input
                                    className={inputClass}
                                    value={section.subtitle}
                                    onChange={(event) =>
                                      onUpdateSectionField?.(
                                        chapter.id,
                                        section.id,
                                        "subtitle",
                                        event.target.value
                                      )
                                    }
                                  />
                                </Field>
                                <Field label="Section eyebrow">
                                  <input
                                    className={inputClass}
                                    value={section.eyebrow}
                                    onChange={(event) =>
                                      onUpdateSectionField?.(
                                        chapter.id,
                                        section.id,
                                        "eyebrow",
                                        event.target.value
                                      )
                                    }
                                    placeholder={`Section ${sectionIndex + 1}`}
                                  />
                                </Field>
                                <Field label="Display date">
                                  <input
                                    className={inputClass}
                                    value={section.displayDate}
                                    onChange={(event) =>
                                      onUpdateSectionField?.(
                                        chapter.id,
                                        section.id,
                                        "displayDate",
                                        event.target.value
                                      )
                                    }
                                  />
                                </Field>
                                <Field label="Era">
                                  <input
                                    className={inputClass}
                                    value={section.era}
                                    onChange={(event) =>
                                      onUpdateSectionField?.(
                                        chapter.id,
                                        section.id,
                                        "era",
                                        event.target.value
                                      )
                                    }
                                  />
                                </Field>
                                <Field label="Section summary">
                                  <textarea
                                    className={`${inputClass} min-h-24 resize-y`}
                                    value={section.summary}
                                    onChange={(event) =>
                                      onUpdateSectionField?.(
                                        chapter.id,
                                        section.id,
                                        "summary",
                                        event.target.value
                                      )
                                    }
                                  />
                                </Field>
                              </div>

                              <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4">
                                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
                                  Section-only Character Tags
                                </p>
                                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                                  These tags apply only to this section. Owned tags can
                                  also supply Character-library images here.
                                </p>
                                <ReferenceSelector
                                  ownedItems={ownedCharacters}
                                  likedItems={likedCharacters}
                                  selectedRefs={section.characterRefs}
                                  onToggle={(character) =>
                                    onToggleSectionCharacter?.(
                                      chapter.id,
                                      section.id,
                                      character
                                    )
                                  }
                                  ownedStatus={ownedCharacterLoadStatus}
                                  likedStatus={likedCharacterLoadStatus}
                                  ownedMessage={ownedCharacterLoadMessage}
                                  likedMessage={likedCharacterLoadMessage}
                                  maxSelections={limits.maxSectionCharacterRefs}
                                  singularLabel="Character"
                                  pluralLabel="Characters"
                                  Icon={Users}
                                />
                              </div>

                              <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4">
                                <div className="flex items-center gap-2 text-[var(--muted-gold)]">
                                  <MapPin size={15} />
                                  <p className="text-xs uppercase tracking-[0.18em]">
                                    Section-only Location Tags
                                  </p>
                                </div>
                                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                                  These Locations apply only to this section.
                                </p>
                                <ReferenceSelector
                                  ownedItems={ownedLocations}
                                  likedItems={likedLocations}
                                  selectedRefs={section.locationRefs}
                                  onToggle={(location) =>
                                    onToggleSectionLocation?.(
                                      chapter.id,
                                      section.id,
                                      location
                                    )
                                  }
                                  ownedStatus={ownedLocationLoadStatus}
                                  likedStatus={likedLocationLoadStatus}
                                  ownedMessage={ownedLocationLoadMessage}
                                  likedMessage={likedLocationLoadMessage}
                                  maxSelections={limits.maxSectionLocationRefs}
                                  singularLabel="Location"
                                  pluralLabel="Locations"
                                  Icon={MapPin}
                                />
                              </div>

                              <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/20 p-4">
                                <div>
                                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
                                    Section Content
                                  </p>
                                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                                    Add writing, media, layout, quotation, or reference blocks
                                    from the searchable block library.
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => openBlockPicker(chapter.id, section.id)}
                                  className="inline-flex items-center gap-2 rounded-lg border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-2.5 text-xs uppercase tracking-[0.14em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/15 hover:text-white"
                                >
                                  <Plus size={14} /> Add content block
                                </button>
                              </div>

                              <div className="mt-5 space-y-4">
                                {section.blocks.map((block, blockIndex) => (
                                  <div
                                    key={block.id}
                                    className="rounded-xl border border-white/10 bg-black/30 p-4"
                                  >
                                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                                      <div className="flex items-center gap-2 text-[var(--muted-gold)]">
                                        {block.type === "image" ? (
                                          <BookImage size={15} />
                                        ) : (
                                          <BookOpenText size={15} />
                                        )}
                                        <p className="text-xs uppercase tracking-[0.17em]">
                                          {blockTypes.find(
                                            (option) => option.value === block.type
                                          )?.label || block.type}
                                        </p>
                                      </div>
                                      <div className="flex gap-2">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            onMoveBlock?.(
                                              chapter.id,
                                              section.id,
                                              block.id,
                                              -1
                                            )
                                          }
                                          disabled={blockIndex === 0}
                                          className="rounded-lg border border-white/10 p-2 text-[var(--muted)] disabled:opacity-30"
                                        >
                                          <ArrowUp size={13} />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            onMoveBlock?.(
                                              chapter.id,
                                              section.id,
                                              block.id,
                                              1
                                            )
                                          }
                                          disabled={
                                            blockIndex === section.blocks.length - 1
                                          }
                                          className="rounded-lg border border-white/10 p-2 text-[var(--muted)] disabled:opacity-30"
                                        >
                                          <ArrowDown size={13} />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            onRemoveBlock?.(
                                              chapter.id,
                                              section.id,
                                              block.id
                                            )
                                          }
                                          className="rounded-lg border border-red-300/15 p-2 text-red-200"
                                        >
                                          <Trash2 size={13} />
                                        </button>
                                      </div>
                                    </div>
                                    <BlockFields
                                      block={block}
                                      chapterId={chapter.id}
                                      sectionId={section.id}
                                      imageSizeOptions={imageSizeOptions}
                                      imageAlignOptions={imageAlignOptions}
                                      columnBlockTypes={columnBlockTypes}
                                      limits={limits}
                                      onUpdate={onUpdateBlock}
                                      onOpenImagePicker={onOpenImagePicker}
                                      onAddStatItem={onAddStatItem}
                                      onUpdateStatItem={onUpdateStatItem}
                                      onRemoveStatItem={onRemoveStatItem}
                                      onMoveStatItem={onMoveStatItem}
                                      onAddColumnBlock={onAddColumnBlock}
                                      onUpdateColumnBlock={onUpdateColumnBlock}
                                      onRemoveColumnBlock={onRemoveColumnBlock}
                                      onMoveColumnBlock={onMoveColumnBlock}
                                    />
                                  </div>
                                ))}
                              </div>

                              {section.blocks.length ? (
                                <div className="mt-4 flex justify-center">
                                  <button
                                    type="button"
                                    onClick={() => openBlockPicker(chapter.id, section.id)}
                                    className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-black/25 px-4 py-2 text-xs text-[var(--muted)] transition hover:border-[var(--muted-gold)]/35 hover:text-white"
                                  >
                                    <Plus size={13} /> Add another content block
                                  </button>
                                </div>
                              ) : null}
                            </div>
                          ) : null}
                        </section>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>

      <BlockPickerModal
        picker={blockPicker}
        blockTypes={blockTypes}
        onClose={() => setBlockPicker(null)}
        onChooseBlock={chooseBlock}
      />

      <ImagePickerModal
        picker={imagePicker}
        status={imageLibraryStatus}
        message={imageLibraryMessage}
        images={imageLibraryImages}
        onClose={onCloseImagePicker}
        onSelectCharacter={onSelectImageCharacter}
        onChooseImage={onChooseImage}
      />

      {jsonEditorSlot}
    </section>
  );
}
