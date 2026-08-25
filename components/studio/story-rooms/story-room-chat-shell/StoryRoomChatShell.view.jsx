import {
  Command,
  HelpCircle,
  Keyboard,
  MapPin,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";

import KitModalFrame from "@/components/kit/KitModalFrame";

import { STORY_ROOM_DELETE_CONFIRMATION_LINES } from "./useStoryRoomChatShellViewModel";
import {
  isStoryRoomSwipeInteractiveTarget,
  resolveStoryRoomMobileSwipe,
} from "./storyRoomMobileSwipe";

const EYEBROW_CLASS =
  "text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]";

export default function StoryRoomChatShellView({
  room = {},
  layoutClass = "grid min-h-0 flex-1 gap-5",
  leftOpen = true,
  rightOpen = true,
  mobilePanel = null,
  composerHelpPanel = null,
  commands = [],
  castPanelProps = {},
  mobileCastPanelProps = {},
  transcriptProps = {},
  composerProps = {},
  desktopStatePanelProps = {},
  mobileStatePanelProps = {},
  runtimeMechanicsPanelProps = null,
  onToggleLeftPanel,
  onToggleRightPanel,
  onShowLeftPanel,
  onShowRightPanel,
  onOpenMobileCast,
  onOpenMobileState,
  onCloseMobilePanel,
  onCloseComposerHelpPanel,
  isConfirmingDeleteRoom = false,
  onCancelDeleteRoom,
  onConfirmDeleteRoom,
  CastPanelComponent,
  ComposerComponent,
  MobileDrawerComponent,
  RuntimeMechanicsPanelComponent,
  StatePanelComponent,
  TranscriptComponent,
}) {
  function handleSwipeStart(event) {
    if (typeof window !== "undefined" && window.matchMedia("(min-width: 1280px)").matches) {
      return;
    }

    if (isStoryRoomSwipeInteractiveTarget(event.target)) {
      event.currentTarget.dataset.storyRoomSwipeStartX = "";
      event.currentTarget.dataset.storyRoomSwipeStartY = "";
      return;
    }

    const touch = event.touches?.[0];
    if (!touch) return;

    event.currentTarget.dataset.storyRoomSwipeStartX = String(touch.clientX);
    event.currentTarget.dataset.storyRoomSwipeStartY = String(touch.clientY);
  }

  function handleSwipeEnd(event) {
    const startXRaw = event.currentTarget.dataset.storyRoomSwipeStartX;
    const startYRaw = event.currentTarget.dataset.storyRoomSwipeStartY;
    const touch = event.changedTouches?.[0];

    event.currentTarget.dataset.storyRoomSwipeStartX = "";
    event.currentTarget.dataset.storyRoomSwipeStartY = "";

    if (!startXRaw || !startYRaw || !touch) return;

    const startX = Number(startXRaw);
    const startY = Number(startYRaw);
    if (!Number.isFinite(startX) || !Number.isFinite(startY)) return;

    const action = resolveStoryRoomMobileSwipe({
      panel: null,
      deltaX: touch.clientX - startX,
      deltaY: touch.clientY - startY,
    });

    if (action === "OPEN_CAST") onOpenMobileCast?.();
    if (action === "OPEN_STATE") onOpenMobileState?.();
  }

  return (
    <section
      onTouchStart={handleSwipeStart}
      onTouchEnd={handleSwipeEnd}
      className="-mx-[var(--space-5)] -mt-[var(--space-20)] flex h-[calc(100dvh-var(--space-20))] min-h-0 flex-col overflow-hidden sm:-mx-[var(--space-8)] lg:mx-0 lg:mt-0 lg:h-[calc(100dvh-5rem)] xl:h-[calc(100vh-7rem)]"
    >
      <div className={layoutClass}>
        <div className="hidden min-h-0 xl:block">
          {leftOpen ? (
            CastPanelComponent ? (
              <CastPanelComponent {...castPanelProps} />
            ) : null
          ) : (
            <PanelRevealButton
              side="left"
              label="Show Cast"
              onClick={onShowLeftPanel}
            />
          )}
        </div>

        <main className="flex min-h-0 flex-col overflow-hidden bg-[var(--surface-1)] xl:rounded-[var(--radius-lg)] xl:border xl:border-[var(--line-whisper)]">
          <StoryRoomHeader
            room={room}
            leftOpen={leftOpen}
            rightOpen={rightOpen}
            onToggleLeftPanel={onToggleLeftPanel}
            onToggleRightPanel={onToggleRightPanel}
          />

          {TranscriptComponent ? (
            <TranscriptComponent {...transcriptProps} />
          ) : null}

          <div className="shrink-0">
            {ComposerComponent ? <ComposerComponent {...composerProps} /> : null}
          </div>
        </main>

        <div className="hidden min-h-0 overflow-y-auto pr-1 xl:block">
          {rightOpen ? (
            <div className="min-w-0 pb-4">
              {StatePanelComponent ? (
                <StatePanelComponent {...desktopStatePanelProps} />
              ) : null}
              {RuntimeMechanicsPanelComponent && runtimeMechanicsPanelProps ? (
                <RuntimeMechanicsPanelComponent
                  {...runtimeMechanicsPanelProps}
                />
              ) : null}
            </div>
          ) : (
            <PanelRevealButton
              side="right"
              label="Show State"
              onClick={onShowRightPanel}
            />
          )}
        </div>
      </div>

      {composerHelpPanel ? (
        <StoryRoomComposerHelpPanel
          panel={composerHelpPanel}
          commands={commands}
          onClose={onCloseComposerHelpPanel}
        />
      ) : null}

      {mobilePanel === "cast" && MobileDrawerComponent ? (
        <MobileDrawerComponent
          title="Room & Cast"
          side="left"
          onClose={onCloseMobilePanel}
        >
          {CastPanelComponent ? (
            <CastPanelComponent {...mobileCastPanelProps} />
          ) : null}
        </MobileDrawerComponent>
      ) : null}

      {mobilePanel === "state" && MobileDrawerComponent ? (
        <MobileDrawerComponent
          title="Chronicle State"
          side="right"
          onClose={onCloseMobilePanel}
        >
          {StatePanelComponent ? (
            <StatePanelComponent {...mobileStatePanelProps} />
          ) : null}
          {RuntimeMechanicsPanelComponent && runtimeMechanicsPanelProps ? (
            <RuntimeMechanicsPanelComponent
              {...runtimeMechanicsPanelProps}
            />
          ) : null}
        </MobileDrawerComponent>
      ) : null}

      {isConfirmingDeleteRoom ? (
        <DeleteRoomConfirmSheet
          onCancel={onCancelDeleteRoom}
          onConfirm={onConfirmDeleteRoom}
        />
      ) : null}
    </section>
  );
}

// B5 destructive-action modal confirm, RULED (ED1G ruling 5): replaces
// the room delete flow's prior window.confirm. Same fade-divider,
// ends-aligned Cancel / danger-filled CTA footer as the chat family's
// own delete confirms.
function DeleteRoomConfirmSheet({ onCancel, onConfirm }) {
  return (
    <KitModalFrame variant="sheet" onClose={onCancel} ariaLabel="Confirm delete Story">
      <div className="p-[var(--space-5)]">
        {STORY_ROOM_DELETE_CONFIRMATION_LINES.map((line, index) =>
          line ? (
            <p
              key={`delete-room-line-${index}`}
              className={
                index === 0
                  ? "font-display text-[length:var(--text-subhead)] leading-[var(--lh-subhead)] text-[var(--ink)]"
                  : "mt-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]"
              }
            >
              {line}
            </p>
          ) : (
            <div key={`delete-room-gap-${index}`} className="h-[var(--space-2)]" />
          )
        )}

        <div aria-hidden="true" className="mt-[var(--space-5)] h-px bg-[image:var(--line-fade)]" />
        <div className="mt-[var(--space-4)] flex flex-wrap items-center justify-between gap-[var(--space-2)]">
          <button type="button" onClick={() => onCancel?.()} className="cf-btn cf-btn--secondary">
            Cancel
          </button>
          <button type="button" onClick={() => onConfirm?.()} className="cf-btn cf-btn--danger-filled">
            Delete Story
          </button>
        </div>
      </div>
    </KitModalFrame>
  );
}

function StoryRoomComposerHelpPanel({ panel, commands = [], onClose }) {
  const showCommands = panel === "COMMANDS";

  return (
    <KitModalFrame
      onClose={onClose}
      ariaLabelledBy="story-room-composer-help-title"
      panelClassName="w-full max-w-2xl p-5 sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={EYEBROW_CLASS}>Story Room Composer</p>
          <h2
            id="story-room-composer-help-title"
            className="mt-[var(--space-2)] font-display text-[length:var(--text-subhead)] leading-[var(--lh-subhead)] text-[var(--ink)]"
          >
            {showCommands ? "Available Commands" : "Quick Help"}
          </h2>
        </div>
      </div>

      {showCommands ? (
        <div className="mt-5 grid gap-3">
          {commands.map((command) => (
            <div
              key={command.name}
              className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] p-4"
            >
              <p className="font-mono text-[length:var(--text-body)] text-[var(--gold-ornament)]">
                {command.usage}
              </p>
              <p className="mt-2 text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
                {command.description}
              </p>
              {command.aliases?.length ? (
                <p className="mt-2 text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
                  Alias: {command.aliases.map((alias) => `/${alias}`).join(", ")}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <ComposerHelpItem icon={Keyboard} title="Send and format">
            Press Enter to send. Press Shift+Enter to add a new line.
          </ComposerHelpItem>
          <ComposerHelpItem icon={Command} title="Commands">
            Type / to begin a command. Use /commands for the complete list.
          </ComposerHelpItem>
          <ComposerHelpItem icon={HelpCircle} title="Open help">
            Use /? or /help whenever you need this quick guide again.
          </ComposerHelpItem>
          <ComposerHelpItem icon={MapPin} title="Locations">
            Type # to search and reference locations from the attached Location Registry.
          </ComposerHelpItem>
        </div>
      )}
    </KitModalFrame>
  );
}

function ComposerHelpItem({ icon: Icon, title, children }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] p-4">
      <div className="flex items-center gap-2 text-[var(--gold-ornament)]">
        <Icon size={16} />
        <p className="text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)]">
          {title}
        </p>
      </div>
      <p className="mt-3 text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
        {children}
      </p>
    </div>
  );
}

function StoryRoomHeader({
  room,
  leftOpen,
  rightOpen,
  onToggleLeftPanel,
  onToggleRightPanel,
}) {
  return (
    <div className="hidden shrink-0 border-b border-[var(--line-fade)] p-[var(--space-5)] xl:block">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="min-w-0">
          <p className={EYEBROW_CLASS}>Story</p>

          <h1 className="mt-[var(--space-2)] font-display text-[length:var(--text-title)] leading-[var(--lh-title)]">
            {room?.title}
          </h1>

          <p className="mt-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
            {room?.scenario} · {room?.roomMode}
          </p>
        </div>

        <div className="flex flex-col gap-2 lg:items-end">
          <div className="hidden flex-wrap justify-end gap-2 xl:flex">
            <button
              type="button"
              onClick={() => onToggleLeftPanel?.()}
              className={`inline-flex items-center gap-2 rounded-[var(--radius-md)] border px-4 py-2 text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] transition ${
                leftOpen
                  ? "border-[var(--gold-action)] bg-[var(--fill-whisper)] text-[var(--ink)]"
                  : "border-[var(--line-whisper)] bg-[var(--surface-1)] text-[var(--ink-dim)] hover:border-[var(--gold-ornament)]/35 hover:text-[var(--ink)]"
              }`}
            >
              {leftOpen ? (
                <PanelLeftClose size={14} />
              ) : (
                <PanelLeftOpen size={14} />
              )}
              {leftOpen ? "Cast Open" : "Show Cast"}
            </button>

            <button
              type="button"
              onClick={() => onToggleRightPanel?.()}
              className={`inline-flex items-center gap-2 rounded-[var(--radius-md)] border px-4 py-2 text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] transition ${
                rightOpen
                  ? "border-[var(--gold-action)] bg-[var(--fill-whisper)] text-[var(--ink)]"
                  : "border-[var(--line-whisper)] bg-[var(--surface-1)] text-[var(--ink-dim)] hover:border-[var(--gold-ornament)]/35 hover:text-[var(--ink)]"
              }`}
            >
              {rightOpen ? (
                <PanelRightClose size={14} />
              ) : (
                <PanelRightOpen size={14} />
              )}
              {rightOpen ? "State Open" : "Show State"}
            </button>
          </div>

          <div className="flex flex-wrap gap-2 lg:justify-end">
            <StatusPill>{room?.contentRating}</StatusPill>
            <StatusPill>{room?.visibility}</StatusPill>
          </div>
        </div>
      </div>
    </div>
  );
}

function PanelRevealButton({ side, label, onClick }) {
  const Icon = side === "left" ? PanelLeftOpen : PanelRightOpen;

  return (
    <div className="sticky top-24 flex justify-center">
      <button
        type="button"
        onClick={onClick}
        title={label}
        aria-label={label}
        className="flex h-12 w-11 items-center justify-center rounded-[var(--radius-lg)] border border-[var(--line-whisper)] bg-[var(--surface-1)] text-[var(--gold-ornament)] transition hover:bg-[var(--fill-whisper)] hover:text-[var(--ink)]"
      >
        <Icon size={16} />
      </button>
    </div>
  );
}

function StatusPill({ children }) {
  return (
    <span className="whitespace-nowrap rounded-[var(--radius-full)] border border-[var(--line-whisper)] bg-[var(--surface-2)] px-3 py-1 text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-dim)]">
      {children}
    </span>
  );
}
