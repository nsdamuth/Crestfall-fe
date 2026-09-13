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

// A cast card (brief 4 item 6): the art (or the initial on the nested
// card surface under the sanctioned --grad-panel wash) with the name
// centered at the bottom, under the initial or the avatar; the type tag
// top-left on the over-art glass bed (--panel-glass, one step more
// opaque than the translucent --tag-bed-art it carried); the wash over
// the art one token step lighter (--scrim, from a literal gradient
// whose bottom stop sat above --scrim-strong); the selected card on the
// gold ring, gold only for selected. Over-art ink only (--art-ink,
// --art-ink-dim); type at the label floor, never below 11px.
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
      className={`group relative block aspect-[5/2] w-full overflow-hidden rounded-[var(--radius-md)] border text-left transition-[border-color,box-shadow] duration-[var(--dur-hover)] ${
        safeMember.selected
          ? "border-[var(--gold-action)] ring-2 ring-[var(--gold-action)]"
          : safeMember.selectable
            ? "border-[var(--line)] hover:border-[var(--line-strong)]"
            : "border-[var(--line)]"
      } ${safeMember.isActive ? "" : "opacity-[var(--state-disabled-opacity)]"}`}
    >
      {hasImage ? (
        <img
          src={safeMember.avatarUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      ) : (
        <div className="absolute inset-0 flex items-start justify-center bg-[image:var(--grad-panel)] bg-[var(--surface-2)] pt-[var(--space-4)]">
          <span className="font-display text-[length:var(--text-heading)] leading-[var(--lh-heading)] text-[var(--gold-ornament)]">
            {safeMember.fallbackInitial || "C"}
          </span>
        </div>
      )}

      {hasImage ? <div aria-hidden="true" className="absolute inset-0 bg-[var(--scrim)]" /> : null}

      <div className="absolute left-[var(--space-2)] top-[var(--space-2)] inline-flex max-w-[calc(100%-3.5rem)] items-center rounded-[var(--radius-full)] border border-[var(--line)] bg-[var(--panel-glass)] px-[var(--space-2)] py-px text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--art-ink-dim)] backdrop-blur-[var(--blur-panel)]">
        {safeMember.typeLabel || "Character"}
      </div>

      {safeMember.selected ? (
        <span
          className="absolute right-[var(--space-2)] top-[var(--space-2)] flex h-7 w-7 items-center justify-center rounded-[var(--radius-full)] border border-[var(--line)] bg-[var(--panel-glass)] text-[var(--gold-bright)] backdrop-blur-[var(--blur-panel)]"
          aria-hidden="true"
        >
          <Check size={14} strokeWidth={2.2} />
        </span>
      ) : null}

      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-[var(--space-1)] px-[var(--space-3)] pb-[var(--space-3)] text-center">
        <p className="w-full truncate text-[length:var(--text-ui)] leading-[var(--lh-ui)] font-[var(--weight-medium)] text-[var(--art-ink)]">
          {safeMember.name || "Unnamed Participant"}
        </p>

        {safeMember.displayState ? (
          <span className="rounded-[var(--radius-full)] border border-[var(--line)] bg-[var(--panel-glass)] px-[var(--space-2)] py-px text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--art-ink-dim)] backdrop-blur-[var(--blur-panel)]">
            {safeMember.displayState}
          </span>
        ) : null}
      </div>
    </CardElement>
  );
}
