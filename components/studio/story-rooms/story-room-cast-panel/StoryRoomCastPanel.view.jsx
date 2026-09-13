import { Check, Shuffle, UserRound, Users, X } from "lucide-react";

import StoryRoomNpcParticipantManagerView from "@/components/studio/story-rooms/story-room-npc-participant-manager/StoryRoomNpcParticipantManager.view";

export default function StoryRoomCastPanelView({
  castHeading = "Cast",
  castDescription = "",
  castMembers = [],
  playerCharacterAction = null,
  setPlayerCharacterError = "",
  npcParticipantManager = null,
  randomLikedAction = null,
  randomLikedError = "",
  playerCharacterPickerContent = null,
  manageCastOpen = false,
  onSelectCastMember = null,
  onOpenPlayerCharacterPicker = null,
  onOpenManageCast = null,
  onCloseManageCast = null,
  onLoadRandomLiked = null,
}) {
  const safeCastMembers = Array.isArray(castMembers) ? castMembers : [];
  const safePlayerCharacterAction = playerCharacterAction || {};
  const safeRandomLikedAction = randomLikedAction || {};

  // The roster and its two actions only (fe/chat-studio item 6): the
  // rail owns the story's media, title, delete, and the way back.
  return (
    <>
      <div className="min-w-0">
        <p className="text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
          {castHeading}
        </p>
        {castDescription ? (
          <p className="mt-[var(--space-2)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
            {castDescription}
          </p>
        ) : null}

        <div className="mt-[var(--space-3)] space-y-[var(--space-3)]">
          {safeCastMembers.map((member, index) => (
            <CastCard
              key={member?.id || index}
              member={member}
              onSelect={onSelectCastMember}
            />
          ))}
        </div>

      <div className="mt-6 grid gap-3">
        {safePlayerCharacterAction.visible ? (
          <button
            type="button"
            onClick={() => onOpenPlayerCharacterPicker?.()}
            disabled={safePlayerCharacterAction.disabled}
            className="cf-btn cf-btn--primary"
          >
            <UserRound size={14} />
            {safePlayerCharacterAction.busy
              ? safePlayerCharacterAction.busyLabel || "Setting"
              : safePlayerCharacterAction.label || "Set player character"}
          </button>
        ) : null}

        {setPlayerCharacterError ? (
          <p className="text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--status-danger-text)]">
            {setPlayerCharacterError}
          </p>
        ) : null}

        <button
          type="button"
          onClick={() => onOpenManageCast?.()}
          className="cf-btn cf-btn--secondary"
          aria-haspopup="dialog"
        >
          <Users size={14} />
          Manage cast
        </button>
      </div>
      </div>

    {manageCastOpen ? (
      <ManageCastModal
        npcParticipantManager={npcParticipantManager}
        randomLikedAction={safeRandomLikedAction}
        randomLikedError={randomLikedError}
        onLoadRandomLiked={onLoadRandomLiked}
        onClose={onCloseManageCast}
      />
    ) : null}

    {playerCharacterPickerContent}
  </>
  );
}

function ManageCastModal({
  npcParticipantManager,
  randomLikedAction,
  randomLikedError,
  onLoadRandomLiked,
  onClose,
}) {
  const safeRandomLikedAction = randomLikedAction || {};

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close manage cast"
        onClick={() => onClose?.()}
        className="absolute inset-0 bg-[var(--scrim-strong)] backdrop-blur-sm"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="story-room-manage-cast-title"
        className="relative z-10 max-h-[90dvh] w-full overflow-y-auto rounded-t-[var(--radius-lg)] border border-[var(--gold-ornament)]/25 bg-[var(--surface-1)] shadow-2xl sm:max-w-2xl sm:rounded-[var(--radius-lg)]"
      >
        <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-white/20 sm:hidden" />

        <header className="flex items-start justify-between gap-4 border-b border-[var(--line)] px-5 pb-5 pt-4 sm:p-6">
          <div>
            <p className="text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
              Cast
            </p>
            <h2
              id="story-room-manage-cast-title"
              className="mt-2 font-display text-3xl text-[var(--ink)]"
            >
              Manage cast
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
              Load registry NPCs or add one of your liked characters.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onClose?.()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--line)] text-[var(--ink-dim)] transition hover:border-[var(--gold-ornament)]/40 hover:text-[var(--ink)]"
            aria-label="Close manage cast"
          >
            <X size={16} />
          </button>
        </header>

        <div className="space-y-6 p-5 sm:p-6">
          <section>
            <div className="mb-3">
              <p className="text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
                Registry NPCs
              </p>
              <p className="mt-1 text-xs leading-5 text-[var(--ink-dim)]">
                Load, unload, and review NPCs supplied by the story or its active location registries.
              </p>
            </div>

            {npcParticipantManager ? (
              <StoryRoomNpcParticipantManagerView {...npcParticipantManager} />
            ) : (
              <p className="rounded-[var(--radius-md)] border border-dashed border-[var(--line)] p-4 text-sm text-[var(--ink-dim)]">
                Registry NPC tools are unavailable for this story.
              </p>
            )}
          </section>

          <section className="border-t border-[var(--line)] pt-5">
            <p className="text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
              Quick add
            </p>
            <p className="mt-1 text-xs leading-5 text-[var(--ink-dim)]">
              Add one of your liked characters without leaving the story.
            </p>

            {safeRandomLikedAction.visible !== false ? (
              <button
                type="button"
                onClick={() => onLoadRandomLiked?.()}
                disabled={safeRandomLikedAction.disabled}
                className="cf-btn cf-btn--secondary mt-4 w-full"
              >
                <Shuffle size={14} />
                {safeRandomLikedAction.busy
                  ? safeRandomLikedAction.busyLabel || "Loading..."
                  : safeRandomLikedAction.label || "Random liked"}
              </button>
            ) : (
              <p className="mt-4 rounded-[var(--radius-md)] border border-dashed border-[var(--line)] p-4 text-sm text-[var(--ink-dim)]">
                Random liked is not available for this story.
              </p>
            )}

            {randomLikedError ? (
              <p className="mt-3 rounded-xl border border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] px-3 py-2 text-xs leading-5 text-[var(--status-danger)]">
                {randomLikedError}
              </p>
            ) : null}
          </section>
        </div>
      </section>
    </div>
  );
}

function CastCard({ member, onSelect }) {
  const safeMember = member || {};
  const CardElement = safeMember.selectable ? "button" : "article";
  const hasImage = Boolean(safeMember.avatarUrl);

  return (
    <CardElement
      type={safeMember.selectable ? "button" : undefined}
      onClick={safeMember.selectable ? () => onSelect?.(safeMember.id) : undefined}
      aria-pressed={safeMember.selectable ? Boolean(safeMember.selected) : undefined}
      aria-label={safeMember.selectable ? safeMember.selectionAriaLabel || undefined : undefined}
      className={`group relative block aspect-[5/2] w-full overflow-hidden rounded-[var(--radius-md)] border text-left transition ${
        safeMember.selected
          ? "border-[var(--gold-bright)]/75 shadow-[0_0_0_1px_rgba(196,163,98,0.2)]"
          : safeMember.selectable
            ? "border-[var(--line)] hover:border-[var(--gold-ornament)]/45"
            : "border-[var(--line)]"
      } ${safeMember.isActive ? "" : "opacity-55"}`}
    >
      {hasImage ? (
        <img
          src={safeMember.avatarUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-[1.015]"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_35%,rgba(196,163,98,0.15),transparent_55%),var(--surface-2)]">
          <span className="font-display text-3xl text-[var(--gold-ornament)]/75">
            {safeMember.fallbackInitial || "C"}
          </span>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/10 to-black/90" />

      <div className="absolute left-2.5 top-2.5 inline-flex max-w-[calc(100%-3.5rem)] items-center rounded-full border border-white/10 bg-[var(--tag-bed-art)] px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] text-white/75 backdrop-blur-sm">
        {safeMember.typeLabel || "Character"}
      </div>

      {safeMember.selected ? (
        <span
          className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full border border-[var(--gold-bright)]/55 bg-[var(--tag-bed-art)] text-[var(--gold-bright)] shadow-sm backdrop-blur-sm"
          aria-hidden="true"
        >
          <Check size={14} strokeWidth={2.2} />
        </span>
      ) : null}

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3">
        <p className="min-w-0 truncate text-sm font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
          {safeMember.name || "Unnamed Participant"}
        </p>

        {safeMember.displayState ? (
          <span className="shrink-0 rounded-full border border-white/10 bg-[var(--tag-bed-art)] px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-white/65 backdrop-blur-sm">
            {safeMember.displayState}
          </span>
        ) : null}
      </div>
    </CardElement>
  );
}
