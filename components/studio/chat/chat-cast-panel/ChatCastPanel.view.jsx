"use client";

import { useState } from "react";
import { Image as ImageIcon, PanelLeftClose } from "lucide-react";

import KitModalFrame from "@/components/kit/KitModalFrame";
import ChatNpcManagerView from "../chat-npc-manager/ChatNpcManager.view";

// Party panel, RULED 23 Aug 2026 (build-0823 pass 2): renamed from
// Cast, fixed 5 slots. Set Player Character, Random Liked, and
// Delete Story moved out of this panel (Delete Story now lives on
// chat-state-panel's management row); double-clicking a filled slot
// or tapping an open slot opens the Party roster, wired by the
// caller through onOpenPartyRoster.
const MAX_PARTY_SIZE = 5;

function CastPanelContent({
  eyebrow,
  canClose,
  onClosePanel,
  featuredMedia,
  roomTitle,
  roomIdLabel,
  narrator,
  partyHeading,
  partyDescription,
  partyMembers,
  npcParticipantManager,
  roomListHref,
  roomListLabel,
  onOpenPartyRoster,
  onOpenSceneImagePicker,
}) {
  const safeFeaturedMedia = featuredMedia || {};
  const safeNarrator = narrator || {};
  const safePartyMembers = Array.isArray(partyMembers) ? partyMembers : [];
  const filledSlots = safePartyMembers.slice(0, MAX_PARTY_SIZE);
  const openSlotCount = Math.max(MAX_PARTY_SIZE - filledSlots.length, 0);

  return (
    <div>
      <div className="mb-[var(--space-4)] flex items-center justify-between gap-[var(--space-3)]">
        <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
          {eyebrow}
        </p>

        {canClose ? (
          <button
            type="button"
            onClick={() => onClosePanel?.()}
            className="flex h-[var(--control-sm)] w-[var(--control-sm)] touch-manipulation items-center justify-center rounded-[var(--radius-md)] border border-[var(--line-whisper)] text-[var(--ink-dim)] transition hover:border-[var(--line)] hover:text-[var(--ink)] [@media(pointer:coarse)]:h-[var(--control-md)] [@media(pointer:coarse)]:w-[var(--control-md)]"
            aria-label="Hide party panel"
            title="Hide party panel"
          >
            <PanelLeftClose size={15} aria-hidden="true" />
          </button>
        ) : null}
      </div>

      {/* Missing-image law (BUILD-BLUEPRINT 2.16(ac)): icon-only well,
          no caption, dead-centered on both axes. */}
      <button
        type="button"
        onClick={() => onOpenSceneImagePicker?.()}
        className="flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line-whisper)] bg-[var(--surface-1)] transition hover:border-[var(--line)]"
        aria-label="Open the image selector"
      >
        {safeFeaturedMedia.imageUrl ? (
          <div className="relative h-full w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={safeFeaturedMedia.imageUrl}
              alt={safeFeaturedMedia.imageAltText || "Room media"}
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--scrim-strong)] via-[var(--scrim)] to-transparent p-[var(--space-4)]">
              <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--art-gold)]">
                {safeFeaturedMedia.imageEyebrow || "Last Speaker Media"}
              </p>
              <p className="mt-[var(--space-1)] text-[length:var(--text-ui)] text-[var(--art-ink)]">
                {safeFeaturedMedia.speakerName || "Story"}
              </p>
            </div>
          </div>
        ) : (
          <ImageIcon className="text-[var(--gold-ornament)]" size={34} aria-hidden="true" />
        )}
      </button>

      <h2 className="mt-[var(--space-5)] font-display text-[length:var(--text-heading)] leading-[var(--lh-heading)]">
        {roomTitle}
      </h2>

      <p className="mt-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
        Active room ID: <span className="text-[var(--ink)]">{roomIdLabel}</span>
      </p>

      <div className="mt-[var(--space-5)] space-y-[var(--space-3)]">
        <RoomInfoLine label={safeNarrator.label || "Narrator"} value={safeNarrator.value || ""} />
      </div>

      <div className="mt-[var(--space-6)]">
        <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
          {partyHeading || "Party"}
        </p>
        {partyDescription ? (
          <p className="mt-[var(--space-2)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
            {partyDescription}
          </p>
        ) : null}

        <div className="mt-[var(--space-3)] space-y-[var(--space-2)]">
          {filledSlots.map((member, index) => (
            <PartySlotRow key={member?.id || index} member={member} onOpenPartyRoster={onOpenPartyRoster} />
          ))}

          {Array.from({ length: openSlotCount }, (_, index) => (
            <OpenPartySlotRow
              key={`open-slot-${index}`}
              onOpenPartyRoster={onOpenPartyRoster}
              maxSize={MAX_PARTY_SIZE}
            />
          ))}
        </div>
      </div>

      <div className="mt-[var(--space-6)] grid gap-[var(--space-3)]">
        {npcParticipantManager ? <ChatNpcManagerView {...npcParticipantManager} /> : null}

        <a
          href={roomListHref || "/studio/story-rooms"}
          className="inline-flex min-h-[var(--control-md)] touch-manipulation items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--gold-action)]/35 bg-[var(--fill)] px-[var(--space-4)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-bright)] transition hover:bg-[var(--fill-strong)]"
        >
          {roomListLabel || "Room List"}
        </a>
      </div>
    </div>
  );
}

export default function ChatCastPanelView(props) {
  const { initialMobileOpen = false, mobileOpen: controlledMobileOpen, onMobileOpenChange, ...contentProps } = props;

  const [localMobileOpen, setLocalMobileOpen] = useState(initialMobileOpen);
  const isControlled = typeof controlledMobileOpen === "boolean";
  const mobileOpen = isControlled ? controlledMobileOpen : localMobileOpen;

  function closeMobile() {
    if (isControlled) {
      onMobileOpenChange?.(false);
      return;
    }

    setLocalMobileOpen(false);
  }

  return (
    <>
      <aside className="hidden min-w-0 overflow-hidden self-start rounded-[var(--radius-lg)] border border-[var(--line-whisper)] bg-[var(--surface-3)] p-[var(--space-5)] xl:sticky xl:top-[var(--topbar-h)] xl:block">
        <CastPanelContent {...contentProps} />
      </aside>

      {mobileOpen ? (
        <KitModalFrame variant="sheet" sheetGrabber onClose={closeMobile} ariaLabel="Party">
          <div className="p-[var(--space-4)]">
            <CastPanelContent {...contentProps} canClose={false} />
          </div>
        </KitModalFrame>
      ) : null}
    </>
  );
}

function RoomInfoLine({ label, value }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] p-[var(--space-3)]">
      <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
        {label}
      </p>
      <p className="mt-[var(--space-2)] text-[length:var(--text-ui)] text-[var(--ink)]">{value}</p>
    </div>
  );
}

function PartySlotRow({ member, onOpenPartyRoster }) {
  const safeMember = member || {};

  return (
    <button
      type="button"
      onDoubleClick={() => onOpenPartyRoster?.()}
      className="flex w-full touch-manipulation items-center gap-[var(--space-3)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] p-[var(--space-2)] text-left transition hover:border-[var(--line)]"
    >
      <span
        aria-hidden="true"
        className="flex h-[var(--control-filter)] w-[var(--control-filter)] shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-sm)] bg-[var(--chat-avatar-fill)]"
        style={safeMember.color ? { "--chat-speaker": safeMember.color } : undefined}
      >
        {safeMember.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={safeMember.avatarUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="font-display text-[length:var(--text-ui)] text-[var(--chat-speaker-name)]">
            {safeMember.fallbackInitial || "?"}
          </span>
        )}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[length:var(--text-ui)] text-[var(--ink)]">
          {safeMember.name || "Unnamed Participant"}
        </p>
        {safeMember.role ? (
          <p className="mt-[2px] truncate text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-dim)]">
            {safeMember.role}
          </p>
        ) : null}
      </div>
    </button>
  );
}

function OpenPartySlotRow({ onOpenPartyRoster, maxSize }) {
  return (
    <button
      type="button"
      onClick={() => onOpenPartyRoster?.()}
      className="flex min-h-[calc(var(--control-filter)+var(--space-4))] w-full touch-manipulation items-center justify-center rounded-[var(--radius-md)] border border-dashed border-[var(--line-strong)] px-[var(--space-3)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-dim)] transition hover:border-[var(--line)] hover:text-[var(--ink)]"
    >
      {`Open slot · ${maxSize} max`}
    </button>
  );
}
