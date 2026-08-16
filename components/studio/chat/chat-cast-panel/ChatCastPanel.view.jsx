"use client";

import { useState } from "react";
import {
  Image as ImageIcon,
  PanelLeftClose,
  Shuffle,
  Sparkles,
  Trash2,
  Users,
  UserRound,
} from "lucide-react";

import KitModalFrame from "@/components/kit/KitModalFrame";
import ChatNpcManagerView from "../chat-npc-manager/ChatNpcManager.view";

function CastPanelContent({
  eyebrow,
  canClose,
  onClosePanel,
  featuredMedia,
  roomTitle,
  roomIdLabel,
  narrator,
  castHeading,
  castDescription,
  castMembers,
  playerCharacterAction,
  setPlayerCharacterError,
  npcParticipantManager,
  randomLikedAction,
  randomLikedError,
  deleteAction,
  deleteError,
  roomListHref,
  roomListLabel,
  playerCharacterPickerContent,
  onSelectCastMember,
  onOpenPlayerCharacterPicker,
  onLoadRandomLiked,
  onRequestDeleteRoom,
}) {
  const safeFeaturedMedia = featuredMedia || {};
  const safeNarrator = narrator || {};
  const safeCastMembers = Array.isArray(castMembers) ? castMembers : [];
  const safePlayerCharacterAction = playerCharacterAction || {};
  const safeRandomLikedAction = randomLikedAction || {};
  const safeDeleteAction = deleteAction || {};

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
            aria-label="Hide cast panel"
            title="Hide cast panel"
          >
            <PanelLeftClose size={15} aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <div className="aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line-whisper)] bg-[var(--surface-1)]">
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
          <div className="flex h-full w-full items-center justify-center">
            <div className="text-center">
              <ImageIcon className="mx-auto text-[var(--gold-ornament)]" size={34} aria-hidden="true" />
              <p className="mt-[var(--space-4)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
                {safeFeaturedMedia.emptyEyebrow || "Room Media"}
              </p>
              <p className="mt-[var(--space-2)] px-[var(--space-4)] text-[length:var(--text-ui)] text-[var(--ink-dim)]">
                {safeFeaturedMedia.emptyMessage || "Featured room image will appear here."}
              </p>
            </div>
          </div>
        )}
      </div>

      <h2 className="mt-[var(--space-5)] font-display text-[length:var(--text-heading)] leading-[var(--lh-heading)]">
        {roomTitle}
      </h2>

      <p className="mt-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
        Active room ID: <span className="text-[var(--ink)]">{roomIdLabel}</span>
      </p>

      <div className="mt-[var(--space-5)] space-y-[var(--space-3)]">
        <RoomInfoLine icon={Sparkles} label={safeNarrator.label || "Narrator"} value={safeNarrator.value || ""} />
      </div>

      <div className="mt-[var(--space-6)]">
        <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
          {castHeading}
        </p>
        {castDescription ? (
          <p className="mt-[var(--space-2)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
            {castDescription}
          </p>
        ) : null}

        <div className="mt-[var(--space-3)] space-y-[var(--space-3)]">
          {safeCastMembers.map((member, index) => (
            <CastCard key={member?.id || index} member={member} onSelect={onSelectCastMember} />
          ))}
        </div>
      </div>

      <div className="mt-[var(--space-6)] grid gap-[var(--space-3)]">
        {safePlayerCharacterAction.visible ? (
          <button
            type="button"
            onClick={() => onOpenPlayerCharacterPicker?.()}
            disabled={safePlayerCharacterAction.disabled}
            className="inline-flex min-h-[var(--control-md)] touch-manipulation items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--gold-action)]/35 bg-[var(--fill)] px-[var(--space-4)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-bright)] transition hover:bg-[var(--fill-strong)] disabled:cursor-wait disabled:opacity-[var(--state-disabled-opacity)]"
          >
            <UserRound size={14} aria-hidden="true" />
            {safePlayerCharacterAction.busy
              ? safePlayerCharacterAction.busyLabel || "Setting"
              : safePlayerCharacterAction.label || "Set Player Character"}
          </button>
        ) : null}

        {setPlayerCharacterError ? <ErrorLine>{setPlayerCharacterError}</ErrorLine> : null}

        {npcParticipantManager ? <ChatNpcManagerView {...npcParticipantManager} /> : null}

        {safeRandomLikedAction.visible !== false ? (
          <button
            type="button"
            onClick={() => onLoadRandomLiked?.()}
            disabled={safeRandomLikedAction.disabled}
            className="inline-flex min-h-[var(--control-md)] touch-manipulation items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] px-[var(--space-4)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-dim)] transition hover:border-[var(--line)] hover:text-[var(--ink)] disabled:cursor-wait disabled:opacity-[var(--state-disabled-opacity)]"
          >
            <Shuffle size={14} aria-hidden="true" />
            {safeRandomLikedAction.busy
              ? safeRandomLikedAction.busyLabel || "Loading"
              : safeRandomLikedAction.label || "Random Liked"}
          </button>
        ) : null}

        {randomLikedError ? <ErrorLine>{randomLikedError}</ErrorLine> : null}

        {safeDeleteAction.visible ? (
          <button
            type="button"
            onClick={() => onRequestDeleteRoom?.()}
            disabled={safeDeleteAction.disabled}
            className="inline-flex min-h-[var(--control-md)] touch-manipulation items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-transparent bg-transparent px-[var(--space-4)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--status-danger)] transition hover:bg-[var(--status-danger-bed)] disabled:cursor-wait disabled:opacity-[var(--state-disabled-opacity)]"
          >
            <Trash2 size={14} aria-hidden="true" />
            {safeDeleteAction.busy ? safeDeleteAction.busyLabel || "Deleting" : safeDeleteAction.label || "Delete Story"}
          </button>
        ) : null}

        {deleteError ? <ErrorLine>{deleteError}</ErrorLine> : null}

        <a
          href={roomListHref || "/studio/story-rooms"}
          className="inline-flex min-h-[var(--control-md)] touch-manipulation items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--gold-action)]/35 bg-[var(--fill)] px-[var(--space-4)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-bright)] transition hover:bg-[var(--fill-strong)]"
        >
          {roomListLabel || "Room List"}
        </a>
      </div>

      {playerCharacterPickerContent}
    </div>
  );
}

function DeleteConfirmSheet({ message = "", pending = false, error = "", onConfirm, onCancel }) {
  const lines = String(message || "").split("\n");

  return (
    <KitModalFrame variant="sheet" onClose={onCancel} ariaLabel="Confirm delete Story">
      <div className="p-[var(--space-5)]">
        {lines.map((line, index) =>
          line ? (
            <p
              key={`delete-line-${index}`}
              className={
                index === 0
                  ? "font-display text-[length:var(--text-subhead)] leading-[var(--lh-subhead)] text-[var(--ink)]"
                  : "mt-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]"
              }
            >
              {line}
            </p>
          ) : (
            <div key={`delete-gap-${index}`} className="h-[var(--space-2)]" />
          )
        )}

        {error ? <ErrorLine>{error}</ErrorLine> : null}

        <div className="mt-[var(--space-5)] flex justify-end gap-[var(--space-2)]">
          <button type="button" onClick={() => onCancel?.()} className="cf-btn cf-btn--secondary" disabled={pending}>
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm?.()}
            className="cf-btn cf-btn--danger-filled"
            disabled={pending}
          >
            {pending ? "Deleting" : "Delete Story"}
          </button>
        </div>
      </div>
    </KitModalFrame>
  );
}

export default function ChatCastPanelView(props) {
  const {
    deleteConfirm,
    initialMobileOpen = false,
    ...contentProps
  } = props;

  const [mobileOpen, setMobileOpen] = useState(initialMobileOpen);

  return (
    <>
      <aside className="hidden min-w-0 overflow-hidden self-start rounded-[var(--radius-lg)] border border-[var(--line-whisper)] bg-[var(--surface-3)] p-[var(--space-5)] xl:sticky xl:top-24 xl:block">
        <CastPanelContent {...contentProps} />
      </aside>

      <div className="xl:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="inline-flex min-h-[var(--control-md)] touch-manipulation items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] px-[var(--space-4)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-dim)]"
        >
          <Users size={14} aria-hidden="true" />
          Room &amp; Cast
        </button>

        {mobileOpen ? (
          <KitModalFrame variant="sheet" onClose={() => setMobileOpen(false)} ariaLabel="Room and cast">
            <div className="p-[var(--space-4)]">
              <CastPanelContent {...contentProps} canClose={false} />
            </div>
          </KitModalFrame>
        ) : null}
      </div>

      {deleteConfirm?.open ? <DeleteConfirmSheet {...deleteConfirm} /> : null}
    </>
  );
}

function RoomInfoLine({ icon: Icon, label, value }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] p-[var(--space-3)]">
      <p className="inline-flex items-center gap-[var(--space-2)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
        <Icon size={13} aria-hidden="true" />
        {label}
      </p>
      <p className="mt-[var(--space-2)] text-[length:var(--text-ui)] text-[var(--ink)]">{value}</p>
    </div>
  );
}

function ErrorLine({ children }) {
  return (
    <p
      className="rounded-[var(--radius-md)] border border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--status-danger)]"
      role="alert"
    >
      {children}
    </p>
  );
}

function CastCard({ member, onSelect }) {
  const safeMember = member || {};
  const CardElement = safeMember.selectable ? "button" : "article";

  return (
    <CardElement
      type={safeMember.selectable ? "button" : undefined}
      onClick={safeMember.selectable ? () => onSelect?.(safeMember.id) : undefined}
      aria-pressed={safeMember.selectable ? Boolean(safeMember.selected) : undefined}
      aria-label={safeMember.selectable ? safeMember.selectionAriaLabel || undefined : undefined}
      className={`w-full touch-manipulation rounded-[var(--radius-md)] border p-[var(--space-3)] text-left transition ${
        safeMember.selected
          ? "border-[var(--gold-action)]/65 bg-[var(--fill)]"
          : safeMember.selectable
            ? "border-[var(--line-whisper)] bg-[var(--surface-1)] hover:border-[var(--line)] hover:bg-[var(--state-hover-fill)]"
            : "border-[var(--line-whisper)] bg-[var(--surface-1)]"
      } ${safeMember.isActive ? "" : "opacity-[var(--state-disabled-opacity)]"}`}
    >
      <div className="flex gap-[var(--space-3)]">
        <div
          className={`h-14 w-14 shrink-0 overflow-hidden rounded-[var(--radius-sm)] border bg-[var(--surface-3)] ${
            safeMember.selected ? "border-[var(--gold-action)]/70" : "border-[var(--line-whisper)]"
          }`}
        >
          {safeMember.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={safeMember.avatarUrl} alt={safeMember.name || "Cast member"} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-display text-[length:var(--text-lead)] text-[var(--gold-ornament)]">
              {safeMember.fallbackInitial || "C"}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-[var(--space-2)]">
            <p className="text-[length:var(--text-ui)] text-[var(--ink)]">
              {safeMember.name || "Unnamed Participant"}
            </p>
            <span
              className={`rounded-[var(--radius-full)] border px-[var(--space-2)] py-[var(--space-1)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] ${
                safeMember.selected
                  ? "border-[var(--gold-action)]/55 bg-[var(--fill)] text-[var(--gold-bright)]"
                  : "border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--ink-faint)]"
              }`}
            >
              {safeMember.selectionLabel || "Inactive"}
            </span>
          </div>

          <p className="mt-[var(--space-1)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
            {safeMember.role || ""}
          </p>

          <p className="mt-[var(--space-1)] text-[length:var(--text-label)] text-[var(--ink-faint)]">
            {safeMember.state || ""}
          </p>

          {safeMember.note ? (
            <p className="mt-[var(--space-2)] line-clamp-2 text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
              {safeMember.note}
            </p>
          ) : null}
        </div>
      </div>
    </CardElement>
  );
}
