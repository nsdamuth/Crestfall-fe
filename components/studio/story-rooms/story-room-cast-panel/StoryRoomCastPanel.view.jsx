import {
  Image as ImageIcon,
  PanelLeftClose,
  Shuffle,
  Sparkles,
  Trash2,
  UserRound,
} from "lucide-react";

import StoryRoomNpcParticipantManagerView from "@/components/studio/story-rooms/story-room-npc-participant-manager/StoryRoomNpcParticipantManager.view";

export default function StoryRoomCastPanelView({
  eyebrow = "Room & Cast",
  canClose = false,
  featuredMedia = null,
  roomTitle = "Untitled Story",
  roomIdLabel = "",
  narrator = null,
  castHeading = "Cast",
  castDescription = "",
  castMembers = [],
  playerCharacterAction = null,
  setPlayerCharacterError = "",
  npcParticipantManager = null,
  randomLikedAction = null,
  randomLikedError = "",
  deleteAction = null,
  deleteError = "",
  roomListHref = "/studio/story-rooms",
  roomListLabel = "← Room List",
  playerCharacterPickerContent = null,
  onClosePanel = null,
  onSelectCastMember = null,
  onOpenPlayerCharacterPicker = null,
  onLoadRandomLiked = null,
  onDeleteRoom = null,
  LinkComponent = "a",
}) {
  const safeFeaturedMedia = featuredMedia || {};
  const safeNarrator = narrator || {};
  const safeCastMembers = Array.isArray(castMembers) ? castMembers : [];
  const safePlayerCharacterAction = playerCharacterAction || {};
  const safeRandomLikedAction = randomLikedAction || {};
  const safeDeleteAction = deleteAction || {};

  return (
    <aside className="min-w-0 overflow-hidden self-start rounded-2xl border border-[var(--gold-ornament)]/20 bg-black/45 p-5 xl:sticky xl:top-24">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
          {eyebrow}
        </p>

        {canClose ? (
          <button
            type="button"
            onClick={() => onClosePanel?.()}
            className="rounded-lg border border-white/10 p-2 text-[var(--ink-dim)] transition hover:border-[var(--gold-ornament)]/35 hover:text-[var(--ink)]"
            aria-label="Hide cast panel"
            title="Hide cast panel"
          >
            <PanelLeftClose size={15} />
          </button>
        ) : null}
      </div>

      <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-black via-black/80 to-[var(--gold-ornament)]/10">
        {safeFeaturedMedia.imageUrl ? (
          <div className="relative h-full w-full">
            <img
              src={safeFeaturedMedia.imageUrl}
              alt={safeFeaturedMedia.imageAltText || "Room media"}
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/55 to-transparent p-4">
              <p className="text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
                {safeFeaturedMedia.imageEyebrow || "Last Speaker Media"}
              </p>
              <p className="mt-1 text-sm text-[var(--ink)]">
                {safeFeaturedMedia.speakerName || "Story"}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="text-center">
              <ImageIcon
                className="mx-auto text-[var(--gold-ornament)]"
                size={34}
              />
              <p className="mt-4 text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
                {safeFeaturedMedia.emptyEyebrow || "Room Media"}
              </p>
              <p className="mt-2 px-4 text-sm text-[var(--ink-dim)]">
                {safeFeaturedMedia.emptyMessage ||
                  "Featured room image will appear here."}
              </p>
            </div>
          </div>
        )}
      </div>

      <h2 className="mt-5 font-display text-3xl">{roomTitle}</h2>

      <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
        Active room ID:{" "}
        <span className="text-[var(--ink)]">{roomIdLabel}</span>
      </p>

      <div className="mt-5 space-y-3">
        <RoomInfoLine
          icon={Sparkles}
          label={safeNarrator.label || "Narrator"}
          value={safeNarrator.value || ""}
        />
      </div>

      <div className="mt-6">
        <p className="text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
          {castHeading}
        </p>
        {castDescription ? (
          <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">
            {castDescription}
          </p>
        ) : null}

        <div className="mt-3 space-y-3">
          {safeCastMembers.map((member, index) => (
            <CastCard
              key={member?.id || index}
              member={member}
              onSelect={onSelectCastMember}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        {safePlayerCharacterAction.visible ? (
          <button
            type="button"
            onClick={() => onOpenPlayerCharacterPicker?.()}
            disabled={safePlayerCharacterAction.disabled}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[var(--line-strong)] px-6 text-base leading-6 font-bold text-[var(--gold-action)] transition hover:border-[var(--gold-action)] hover:shadow-[var(--glow-hover)] disabled:cursor-wait disabled:opacity-60"
          >
            <UserRound size={14} />
            {safePlayerCharacterAction.busy
              ? safePlayerCharacterAction.busyLabel || "Setting..."
              : safePlayerCharacterAction.label || "Set Player Character"}
          </button>
        ) : null}

        {setPlayerCharacterError ? (
          <p className="rounded-xl border border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] px-3 py-2 text-xs leading-5 text-[var(--status-danger)]">
            {setPlayerCharacterError}
          </p>
        ) : null}

        {npcParticipantManager ? (
          <StoryRoomNpcParticipantManagerView {...npcParticipantManager} />
        ) : null}

        {safeRandomLikedAction.visible !== false ? (
          <button
            type="button"
            onClick={() => onLoadRandomLiked?.()}
            disabled={safeRandomLikedAction.disabled}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[var(--line-strong)] px-6 text-base leading-6 font-bold text-[var(--gold-action)] transition hover:border-[var(--gold-action)] hover:shadow-[var(--glow-hover)] disabled:cursor-wait disabled:opacity-60"
          >
            <Shuffle size={14} />
            {safeRandomLikedAction.busy
              ? safeRandomLikedAction.busyLabel || "Loading..."
              : safeRandomLikedAction.label || "Random Liked"}
          </button>
        ) : null}

        {randomLikedError ? (
          <p className="rounded-xl border border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] px-3 py-2 text-xs leading-5 text-[var(--status-danger)]">
            {randomLikedError}
          </p>
        ) : null}

        {safeDeleteAction.visible ? (
          <button
            type="button"
            onClick={() => onDeleteRoom?.()}
            disabled={safeDeleteAction.disabled}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--status-danger)] px-6 text-base leading-6 font-bold text-[var(--ink)] transition hover:shadow-[var(--glow-hover)] disabled:cursor-wait disabled:opacity-60"
          >
            <Trash2 size={14} />
            {safeDeleteAction.busy
              ? safeDeleteAction.busyLabel || "Deleting..."
              : safeDeleteAction.label || "Delete Story"}
          </button>
        ) : null}

        {deleteError ? (
          <p className="rounded-xl border border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] px-3 py-2 text-xs leading-5 text-[var(--status-danger)]">
            {deleteError}
          </p>
        ) : null}

        <LinkComponent
          href={roomListHref || "/studio/story-rooms"}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[var(--line-strong)] px-6 text-base leading-6 font-bold text-[var(--gold-action)] transition hover:border-[var(--gold-action)] hover:shadow-[var(--glow-hover)]"
        >
          {roomListLabel || "← Room List"}
        </LinkComponent>
      </div>

      {playerCharacterPickerContent}
    </aside>
  );
}

function RoomInfoLine({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-3">
      <p className="inline-flex items-center gap-2 text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
        <Icon size={13} />
        {label}
      </p>

      <p className="mt-2 text-sm text-[var(--ink)]">{value}</p>
    </div>
  );
}

function CastCard({ member, onSelect }) {
  const safeMember = member || {};
  const CardElement = safeMember.selectable ? "button" : "article";

  return (
    <CardElement
      type={safeMember.selectable ? "button" : undefined}
      onClick={
        safeMember.selectable
          ? () => onSelect?.(safeMember.id)
          : undefined
      }
      aria-pressed={
        safeMember.selectable ? Boolean(safeMember.selected) : undefined
      }
      aria-label={
        safeMember.selectable
          ? safeMember.selectionAriaLabel || undefined
          : undefined
      }
      className={`w-full rounded-xl border p-3 text-left transition ${
        safeMember.selected
          ? "border-[var(--gold-ornament)]/65 bg-[var(--gold-ornament)]/15 shadow-[0_0_0_1px_rgba(196,163,98,0.18)]"
          : safeMember.selectable
            ? "border-[var(--line)] bg-[var(--surface-2)] hover:border-[var(--gold-ornament)]/40 hover:bg-[var(--gold-ornament)]/10"
            : "border-[var(--line)] bg-[var(--surface-2)]"
      } ${safeMember.isActive ? "" : "opacity-55"}`}
    >
      <div className="flex gap-3">
        <div
          className={`h-14 w-14 shrink-0 overflow-hidden rounded-xl border bg-[var(--gold-ornament)]/10 ${
            safeMember.selected
              ? "border-[var(--gold-ornament)]/70"
              : "border-[var(--gold-ornament)]/25"
          }`}
        >
          {safeMember.avatarUrl ? (
            <img
              src={safeMember.avatarUrl}
              alt={safeMember.name || "Cast member"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-display text-xl text-[var(--gold-ornament)]">
              {safeMember.fallbackInitial || "C"}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <p className="text-sm text-[var(--ink)]">
              {safeMember.name || "Unnamed Participant"}
            </p>
            <span
              className={`inline-flex h-6 items-center rounded-full px-3 text-[length:var(--text-label)] leading-4 font-medium uppercase tracking-[var(--track-label)] bg-[var(--tag-bed-canvas)] ${
                safeMember.selected
                  ? "text-[var(--gold-bright)]"
                  : "text-[var(--ink-dim)]"
              }`}
            >
              {safeMember.selectionLabel || "Inactive"}
            </span>
          </div>

          <p className="mt-1 text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
            {safeMember.role || ""}
          </p>

          <p className="mt-1 text-xs text-[var(--ink-dim)]">
            {safeMember.state || ""}
          </p>

          {safeMember.note ? (
            <p className="mt-2 line-clamp-2 text-xs leading-5 text-[var(--ink-dim)]">
              {safeMember.note}
            </p>
          ) : null}
        </div>
      </div>
    </CardElement>
  );
}
