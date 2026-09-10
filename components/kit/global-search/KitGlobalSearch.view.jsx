"use client";

// Portable Skin for the top bar global search (FE/GLOBAL-SEARCH
// session 1, 10 Sep 2026, docs/references/global-search/NOTES.md).
// One field; results in a popover directly below it at 700px and up,
// or a full-height sheet with the input pinned at the top under 700px
// (KitModalFrame variant="sheet", the same frame the dropdown and the
// filter panel already use). Two sections, the user's own items first,
// then community. Row grammar (RULED, option 1 at the plan gate):
// icon, title, then "Type · Page" right-aligned in quiet ink at 700px
// and up, dropping to a second line under the title on phones.
// Stateless: every flag and callback arrives from
// useKitGlobalSearchViewModel.
import {
  Clapperboard,
  Compass,
  Gamepad2,
  Image as ImageIcon,
  MapPin,
  MessagesSquare,
  PersonStanding,
  ScrollText,
  Search,
  Shirt,
  SlidersHorizontal,
  User,
  Users,
  X,
} from "lucide-react";

import KitModalFrame from "../KitModalFrame";
import { SoonChip } from "../form-field/SoonChip";

const ICONS = Object.freeze({
  character: User,
  player: Gamepad2,
  pose: PersonStanding,
  outfit: Shirt,
  location: MapPin,
  preset: SlidersHorizontal,
  story: MessagesSquare,
  adventure: Compass,
  creator: Users,
  lore: ScrollText,
  image: ImageIcon,
  video: Clapperboard,
  media: ImageIcon,
});

const PANEL_SURFACE =
  "rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--panel-ui-glass)] backdrop-blur-[var(--blur-panel)]";

const ROW_RECIPE =
  "flex min-h-[var(--control-md)] w-full items-center gap-[var(--space-3)] rounded-[var(--radius-sm)] px-[var(--space-3)] py-[var(--space-2)] text-left transition-colors";

const META_RECIPE =
  "text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]";

function RowIcon({ iconKey = "", imageSrc = "" }) {
  if (imageSrc) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageSrc}
        alt=""
        className="h-6 w-6 flex-none rounded-[var(--radius-xs)] border border-[var(--line-whisper)] object-cover"
      />
    );
  }
  const Icon = ICONS[iconKey] || Search;
  return (
    <span className="flex h-6 w-6 flex-none items-center justify-center text-[var(--ink-dim)]">
      <Icon size={16} aria-hidden="true" />
    </span>
  );
}

function ResultRow({ row = {}, isActive = false, soonTitle = "", onChoose = null, onHover = null }) {
  const meta = row?.pageLabel ? `${row.typeLabel} · ${row.pageLabel}` : row?.typeLabel || "";
  const isSoon = Boolean(row?.isSoon);

  return (
    <button
      type="button"
      role="option"
      id={row?.id}
      aria-selected={isActive}
      disabled={isSoon}
      title={isSoon ? soonTitle : undefined}
      onMouseDown={(event) => event.preventDefault()}
      onMouseEnter={() => (isSoon ? null : onHover?.(row?.id))}
      onClick={() => onChoose?.(row?.id)}
      className={`${ROW_RECIPE} ${
        isSoon
          ? "cursor-not-allowed opacity-[var(--state-disabled-opacity)]"
          : isActive
            ? "bg-[var(--state-hover-fill)] text-[var(--gold-bright)]"
            : "text-[var(--ink)] hover:bg-[var(--state-hover-fill)]"
      }`}
    >
      <RowIcon iconKey={row?.iconKey} imageSrc={row?.imageSrc} />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="flex min-w-0 items-baseline gap-[var(--space-2)]">
          <span className="truncate text-[length:var(--text-ui)] leading-[var(--lh-ui)]">
            {row?.title}
          </span>
          {row?.subtitle ? (
            <span className={`hidden min-w-0 truncate min-[700px]:inline ${META_RECIPE}`}>
              {row.subtitle}
            </span>
          ) : null}
        </span>
        {meta ? (
          <span className={`block truncate min-[700px]:hidden ${META_RECIPE}`}>{meta}</span>
        ) : null}
      </span>
      {meta ? (
        <span className={`hidden flex-none min-[700px]:inline ${META_RECIPE}`}>{meta}</span>
      ) : null}
      {isSoon ? <SoonChip /> : null}
    </button>
  );
}

function SuggestionRow({ suggestion = {}, isActive = false, onChoose = null, onHover = null }) {
  return (
    <button
      type="button"
      role="option"
      id={suggestion?.id}
      aria-selected={isActive}
      onMouseDown={(event) => event.preventDefault()}
      onMouseEnter={() => onHover?.(suggestion?.id)}
      onClick={() => onChoose?.(suggestion?.id)}
      className={`${ROW_RECIPE} ${
        isActive
          ? "bg-[var(--state-hover-fill)] text-[var(--gold-bright)]"
          : "text-[var(--ink)] hover:bg-[var(--state-hover-fill)]"
      }`}
    >
      <span className="flex h-6 w-6 flex-none items-center justify-center text-[var(--ink-dim)]">
        <Search size={16} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1 truncate text-[length:var(--text-ui)] leading-[var(--lh-ui)]">
        {suggestion?.label}
      </span>
      <span className={`hidden flex-none min-[700px]:inline ${META_RECIPE}`}>
        {suggestion?.description}
      </span>
    </button>
  );
}

function PanelMessage({ children = null }) {
  return (
    <p className="px-[var(--space-3)] py-[var(--space-3)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)] text-pretty">
      {children}
    </p>
  );
}

function SectionTitle({ id = "", children = null }) {
  return (
    <h3
      id={id}
      className="px-[var(--space-3)] pb-[var(--space-1)] pt-[var(--space-2)] text-[length:var(--text-label)] uppercase leading-[var(--lh-label)] tracking-[var(--track-label)] text-[var(--ink-dim)]"
    >
      {children}
    </h3>
  );
}

function PanelBody({
  panelState = "hint",
  suggestions = [],
  sections = [],
  activeRowId = null,
  listboxId = "",
  copy = {},
  onChooseRow = null,
  onChooseSuggestion = null,
  onHoverRow = null,
}) {
  if (panelState === "suggestions") {
    return (
      <div role="group" aria-label="Type prefixes">
        {suggestions.map((suggestion) => (
          <SuggestionRow
            key={suggestion?.id}
            suggestion={suggestion}
            isActive={suggestion?.id === activeRowId}
            onChoose={onChooseSuggestion}
            onHover={onHoverRow}
          />
        ))}
      </div>
    );
  }

  if (panelState === "hint") return <PanelMessage>{copy?.hint}</PanelMessage>;
  if (panelState === "loading") return <PanelMessage>{copy?.loading}</PanelMessage>;
  if (panelState === "empty") return <PanelMessage>{copy?.empty}</PanelMessage>;

  return sections.map((section) => {
    const titleId = `${listboxId}-${section?.id}-title`;
    return (
      <div key={section?.id} role="group" aria-labelledby={titleId}>
        <SectionTitle id={titleId}>{section?.title}</SectionTitle>
        {section?.isSoon ? (
          <p className="flex items-center gap-[var(--space-2)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)] opacity-[var(--state-disabled-opacity)]">
            <span>{copy?.soonTitle}</span>
            <SoonChip inline />
          </p>
        ) : null}
        {section?.errorMessage ? (
          <p className="px-[var(--space-3)] py-[var(--space-1)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--status-warning-text)]">
            {section.errorMessage}
          </p>
        ) : null}
        {section?.status === "loading" && !section?.rows?.length ? (
          <PanelMessage>{copy?.loading}</PanelMessage>
        ) : null}
        {(section?.rows || []).map((row) => (
          <ResultRow
            key={row?.id}
            row={row}
            isActive={row?.id === activeRowId}
            soonTitle={copy?.soonTitle}
            onChoose={onChooseRow}
            onHover={onHoverRow}
          />
        ))}
      </div>
    );
  });
}

function SearchFieldBox({
  value = "",
  placeholder = "",
  ariaLabel = "",
  isOpen = false,
  listboxId = "",
  activeRowId = null,
  shortcutHint = "",
  clearLabel = "",
  inputRef = null,
  autoFocus = false,
  onChange = null,
  onOpen = null,
  onInputKeyDown = null,
  onClear = null,
}) {
  return (
    <div className="kit-search-field flex h-[var(--control-md)] w-full items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-3)] transition-colors hover:border-[var(--line)]">
      <Search size={16} className="flex-none text-[var(--ink-faint)]" aria-hidden="true" />
      <input
        ref={inputRef}
        type="text"
        role="combobox"
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-activedescendant={activeRowId || undefined}
        aria-autocomplete="list"
        autoComplete="off"
        autoFocus={autoFocus}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange?.(event.target.value)}
        onFocus={() => onOpen?.()}
        onClick={() => onOpen?.()}
        onKeyDown={(event) => onInputKeyDown?.(event)}
        className="kit-search-input w-full min-w-0 bg-transparent text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:outline-none [@media(pointer:coarse)]:text-[length:var(--text-body)]"
      />
      {value ? (
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => onClear?.()}
          aria-label={clearLabel}
          className="flex flex-none items-center justify-center text-[var(--ink-faint)] transition-colors hover:text-[var(--ink-dim)]"
        >
          <X size={14} aria-hidden="true" />
        </button>
      ) : shortcutHint ? (
        <kbd
          aria-hidden="true"
          className="hidden flex-none rounded-[var(--radius-xs)] border border-[var(--line-whisper)] px-[var(--space-1)] font-sans text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-faint)] min-[700px]:inline"
        >
          {shortcutHint}
        </kbd>
      ) : null}
    </div>
  );
}

export default function KitGlobalSearchView({
  value = "",
  placeholder = "Search everything",
  ariaLabel = "Search everything",
  isOpen = false,
  isPhoneWidth = false,
  rootRef = null,
  inputRef = null,
  listboxId = "",
  activeRowId = null,
  suggestions = [],
  sections = [],
  panelState = "hint",
  shortcutHint = "",
  copy = {},
  className = "",
  onChange = null,
  onOpen = null,
  onClose = null,
  onInputKeyDown = null,
  onChooseRow = null,
  onChooseSuggestion = null,
  onHoverRow = null,
  onClear = null,
}) {
  const fieldProps = {
    value,
    placeholder,
    ariaLabel,
    isOpen,
    listboxId,
    activeRowId,
    shortcutHint,
    clearLabel: copy?.clearLabel,
    onChange,
    onOpen,
    onInputKeyDown,
    onClear,
  };

  const bodyProps = {
    panelState,
    suggestions,
    sections,
    activeRowId,
    listboxId,
    copy,
    onChooseRow,
    onChooseSuggestion,
    onHoverRow,
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <SearchFieldBox {...fieldProps} inputRef={inputRef} />

      {isOpen && !isPhoneWidth ? (
        // Popover, 700px and up: the width of the field, never wider
        // than the viewport, capped so it always clears the bottom
        // edge below the sticky top bar; rows scroll inside.
        <div
          id={listboxId}
          role="listbox"
          aria-label={ariaLabel}
          className={`absolute left-0 right-0 top-[calc(100%+var(--space-1))] z-50 max-h-[min(28rem,calc(100dvh-var(--topbar-h)-var(--space-6)))] overflow-y-auto p-[var(--space-2)] ${PANEL_SURFACE}`}
        >
          <PanelBody {...bodyProps} />
          {copy?.keyboardHint ? (
            <p className="mt-[var(--space-1)] border-t border-[var(--line-whisper)] px-[var(--space-3)] pb-[var(--space-1)] pt-[var(--space-2)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
              {copy.keyboardHint}
            </p>
          ) : null}
        </div>
      ) : null}

      {isOpen && isPhoneWidth ? (
        // Phone, under 700px: a full-height sheet (min-height wins over
        // the frame's own height cap) with the input pinned at the top
        // and the results scrolling below it; the frame's header row
        // keeps the close control reachable at every scroll position.
        <KitModalFrame
          variant="sheet"
          sheetGrabber
          ariaLabel={copy?.sheetTitle || ariaLabel}
          panelClassName="min-h-[100dvh]"
          onClose={onClose}
        >
          <div className="flex h-[calc(100dvh-var(--control-md)-var(--space-3)*2-1px-env(safe-area-inset-bottom))] flex-col">
            <div className="px-[var(--space-4)] pb-[var(--space-3)] pt-[var(--space-3)]">
              <SearchFieldBox {...fieldProps} autoFocus />
            </div>
            <div
              id={listboxId}
              role="listbox"
              aria-label={ariaLabel}
              className="min-h-0 flex-1 overflow-y-auto px-[var(--space-2)] pb-[var(--space-2)]"
            >
              <PanelBody {...bodyProps} />
            </div>
          </div>
        </KitModalFrame>
      ) : null}
    </div>
  );
}
