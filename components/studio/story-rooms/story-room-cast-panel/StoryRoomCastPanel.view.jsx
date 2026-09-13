import { Check, UserRound, Users } from "lucide-react";

import StoryChatDialog from "@/components/studio/story-rooms/story-room-chat-shell/StoryChatDialog";
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

// Manage cast on the shared dialog recipe (ruling D3, fe/chat-studio item
// 8, decision F1): eyebrow, title, one sentence, the registry NPC tools as
// the body, Random liked as the secondary action on the left, Done as the
// gold primary on the right. The frame owns the veil, the close control,
// and the sheet below 700px. Exported for the chat shell's
// StoryRoomManageCastDialog binding (brief 4 item 5), so the composer's
// add character circle opens this same dialog.
export function ManageCastModal({
  npcParticipantManager,
  randomLikedAction,
  randomLikedError,
  onLoadRandomLiked,
  onClose,
}) {
  const safeRandomLikedAction = randomLikedAction || {};
  const randomLikedAvailable = safeRandomLikedAction.visible !== false;

  return (
    <StoryChatDialog
      eyebrow="Cast"
      title="Manage cast"
      sentence="Load registry NPCs or add one of your liked characters."
      panelWidth="42rem"
      titleId="story-room-manage-cast-title"
      secondary={
        randomLikedAvailable
          ? {
              label: safeRandomLikedAction.label || "Random liked",
              busyLabel: safeRandomLikedAction.busyLabel || "Loading",
              busy: Boolean(safeRandomLikedAction.busy),
              disabled: Boolean(safeRandomLikedAction.disabled),
              onPress: () => onLoadRandomLiked?.(),
            }
          : null
      }
      primary={{ label: "Done", onPress: () => onClose?.() }}
      onClose={onClose}
    >
      <section>
        <p className="text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
          Registry NPCs
        </p>
        <p className="mt-[var(--space-1)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
          Load, unload, and review NPCs supplied by the story or its active location registries.
        </p>

        <div className="mt-[var(--space-3)]">
          {npcParticipantManager ? (
            <StoryRoomNpcParticipantManagerView {...npcParticipantManager} />
          ) : (
            <p className="rounded-[var(--radius-md)] border border-dashed border-[var(--line-whisper)] p-[var(--space-4)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
              Registry NPC tools are unavailable for this story.
            </p>
          )}
        </div>
      </section>

      {!randomLikedAvailable ? (
        <p className="mt-[var(--space-4)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
          Random liked is not available for this story.
        </p>
      ) : null}

      {randomLikedError ? (
        <p className="mt-[var(--space-3)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--status-danger-text)]" role="alert">
          {randomLikedError}
        </p>
      ) : null}
    </StoryChatDialog>
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
