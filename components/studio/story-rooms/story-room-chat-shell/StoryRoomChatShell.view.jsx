import { ChevronLeft, Command, HelpCircle, Keyboard, MapPin, Settings } from "lucide-react";

import KitModalFrame from "@/components/kit/KitModalFrame";

import RailPanelGlyph, { BARE_ICON_BUTTON_CLASS } from "./RailPanelGlyph";
import StoryChatDialog from "./StoryChatDialog";
import { STORY_ROOM_DELETE_CONFIRMATION_LINES } from "./useStoryRoomChatShellViewModel";
import {
  isStoryRoomSwipeInteractiveTarget,
  resolveStoryRoomMobileSwipe,
} from "./storyRoomMobileSwipe";

const EYEBROW_CLASS =
  "text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]";

// Three flush columns at md and up (fe/chat-studio item 1, 12 Sep 2026):
// the grid geometry lives in app/design-system.css under
// .cf-story-room-grid[data-rails], the rails collapse to one bare 44px
// edge toggle each, and below md the page is one column under its own
// 44px bar. An open rail sits on --surface-2, one step above the
// primary sidebar, with a hairline against the center, which stays on
// the canvas, so the three columns read as three surfaces (brief 2
// item 6, replacing the card-surface amendment). The View owns no
// viewport reads: `swipeEnabled` arrives from the ViewModel.
export default function StoryRoomChatShellView({
  room = {},
  railsState = "right",
  leftOpen = false,
  rightOpen = true,
  swipeEnabled = false,
  primaryCharacter = null,
  backHref = "/studio/v2/stories",
  mobilePanel = null,
  composerHelpPanel = null,
  commands = [],
  statusSurfaces = [],
  commandCatalogError = "",
  statusSurfaceError = "",
  storyListProps = {},
  transcriptProps = {},
  composerProps = {},
  detailsRailProps = {},
  mobileDetailsRailProps = {},
  onToggleLeftPanel,
  onToggleRightPanel,
  onOpenMobileDetails,
  onOpenMobileStoryList,
  onCloseMobilePanel,
  onCloseComposerHelpPanel,
  isConfirmingDeleteRoom = false,
  isDeletingRoom = false,
  onCancelDeleteRoom,
  onConfirmDeleteRoom,
  ComposerComponent,
  DetailsRailComponent,
  StatusSurfaceHostComponent,
  StoryListComponent,
  TranscriptComponent,
  LinkComponent = "a",
}) {
  function handleSwipeStart(event) {
    if (!swipeEnabled) return;

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

    // Below md a left swipe opens the story details sheet; the right
    // swipe retired with the cast drawer (item 6).
    if (action === "OPEN_STATE") onOpenMobileDetails?.();
  }

  return (
    <section
      onTouchStart={handleSwipeStart}
      onTouchEnd={handleSwipeEnd}
      className="flex h-[100dvh] md:h-[calc(100dvh-var(--topbar-h))] min-h-0 flex-col overflow-hidden"
    >
      <StoryChatMobileBar
        title={room?.title}
        primaryCharacter={primaryCharacter}
        backHref={backHref}
        onOpenStoryList={onOpenMobileStoryList}
        onOpenDetails={onOpenMobileDetails}
        LinkComponent={LinkComponent}
      />

      <div className="cf-story-room-grid min-h-0 flex-1" data-rails={railsState}>
        {/* A closed rail carries no surface (brief 2 item 5): the toggle
            is a bare icon on the page canvas, no fill, no border, no
            column color. An open rail sits one step above the primary
            sidebar's --surface-1 (brief 2 item 6), on --surface-2 with
            the --line-whisper divider against the center; the rail
            views paint no surface of their own, so the tier steps
            resolve from this column. */}
        <div
          className={`hidden min-h-0 flex-col md:flex ${
            leftOpen ? "border-r border-[var(--line-whisper)] bg-[var(--surface-2)]" : ""
          }`}
        >
          <RailEdgeToggle
            side="left"
            open={leftOpen}
            onClick={onToggleLeftPanel}
            openLabel="Open story list"
            closeLabel="Close story list"
          />
          {leftOpen && StoryListComponent ? (
            <div className="min-h-0 flex-1">
              <StoryListComponent {...storyListProps} />
            </div>
          ) : null}
        </div>

        <main className="flex min-h-0 min-w-0 flex-col overflow-hidden bg-[var(--canvas)]">
          {StatusSurfaceHostComponent ? (
            <StatusSurfaceHostComponent
              surfaces={statusSurfaces}
              placement="TOP"
              room={room}
            />
          ) : null}

          {TranscriptComponent ? (
            <TranscriptComponent {...transcriptProps} />
          ) : null}

          {StatusSurfaceHostComponent ? (
            <StatusSurfaceHostComponent
              surfaces={statusSurfaces}
              placement="BOTTOM"
              room={room}
            />
          ) : null}

          {commandCatalogError ? (
            <p className="sr-only" role="status">
              {commandCatalogError}
            </p>
          ) : null}

          {statusSurfaceError ? (
            <p className="sr-only" role="status">
              {statusSurfaceError}
            </p>
          ) : null}
        </main>

        <div
          className={`hidden min-h-0 flex-col md:flex ${
            rightOpen ? "border-l border-[var(--line-whisper)] bg-[var(--surface-2)]" : ""
          }`}
        >
          <RailEdgeToggle
            side="right"
            open={rightOpen}
            onClick={onToggleRightPanel}
            openLabel="Open story details"
            closeLabel="Close story details"
          />
          {rightOpen && DetailsRailComponent ? (
            <div className="min-h-0 flex-1">
              <DetailsRailComponent {...detailsRailProps} />
            </div>
          ) : null}
        </div>
      </div>

      {/* The composer bar (brief 3 item 1): one full-width row beneath
          both rails. The rails end at this row's top edge; the bar's
          surface and top hairline run edge to edge, and the composer's
          content sits in the same grid column as the transcript, so the
          field and its buttons keep the transcript's width and stay
          centered under it at every rail state. The two side cells are
          empty spacers at md and up and do not render below md. */}
      {ComposerComponent ? (
        <div
          className="cf-story-room-grid relative z-50 shrink-0 border-t border-[var(--line-whisper)] bg-[var(--canvas)]"
          data-rails={railsState}
        >
          <div aria-hidden="true" className="hidden md:block" />
          <div className="min-w-0">
            <ComposerComponent {...composerProps} />
          </div>
          <div aria-hidden="true" className="hidden md:block" />
        </div>
      ) : null}

      {composerHelpPanel ? (
        <StoryRoomComposerHelpPanel
          panel={composerHelpPanel}
          commands={commands}
          onClose={onCloseComposerHelpPanel}
        />
      ) : null}

      {/* Below md the story list opens as a left sheet (brief 2 item 11)
          from the mobile bar's story list button (brief 3 item 10), on
          the frame's drawer variant; the same story list package the
          left rail mounts. */}
      {mobilePanel === "stories" && StoryListComponent ? (
        <KitModalFrame variant="drawer" onClose={onCloseMobilePanel} ariaLabel="Stories">
          <div className="flex min-h-0 flex-1 flex-col">
            <StoryListComponent {...storyListProps} />
          </div>
        </KitModalFrame>
      ) : null}

      {mobilePanel === "details" && DetailsRailComponent ? (
        <KitModalFrame
          variant="sheet"
          sheetGrabber
          onClose={onCloseMobilePanel}
          ariaLabel="Story details"
        >
          {/* The frame's sheet caps at 92dvh; the rail scrolls inside a
              bounded column so the header row never has to. */}
          <div className="flex h-[84dvh] min-h-0 w-full flex-col">
            <DetailsRailComponent {...mobileDetailsRailProps} />
          </div>
        </KitModalFrame>
      ) : null}

      {isConfirmingDeleteRoom ? (
        <StoryChatDialog
          eyebrow="Story"
          title={STORY_ROOM_DELETE_CONFIRMATION_LINES[0]}
          sentence={STORY_ROOM_DELETE_CONFIRMATION_LINES[2]}
          tone="danger"
          titleId="story-room-delete-title"
          secondary={{ label: "Cancel", onPress: onCancelDeleteRoom }}
          primary={{
            label: "Delete story",
            busyLabel: "Deleting",
            busy: isDeletingRoom,
            onPress: onConfirmDeleteRoom,
          }}
          onClose={onCancelDeleteRoom}
        />
      ) : null}
    </section>
  );
}

// D2 below md: one 44px bar. Back chevron to the Stories page, the
// primary character's circle, the title truncated, then the story list
// and settings buttons pinned right (brief 3 item 10 returns them from
// the composer's rows; the media button stays retired). The story list
// button carries the shared panel glyph in its closed turn and opens the
// story list as the left sheet; settings opens the details sheet.
function StoryChatMobileBar({
  title = "",
  primaryCharacter = null,
  backHref = "/studio/v2/stories",
  onOpenStoryList,
  onOpenDetails,
  LinkComponent = "a",
}) {
  const initial = String(primaryCharacter?.label || title || "S")
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <div className="flex h-[var(--control-md)] shrink-0 items-center gap-[var(--space-1)] border-b border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-2)] md:hidden">
      <LinkComponent
        href={backHref}
        aria-label="Back to stories"
        className="flex h-[var(--control-md)] w-[var(--control-md)] shrink-0 touch-manipulation items-center justify-center rounded-[var(--radius-full)] text-[var(--ink-dim)] transition-colors duration-[var(--dur-hover)] hover:text-[var(--ink)]"
      >
        <ChevronLeft size={20} aria-hidden="true" />
      </LinkComponent>

      <span className="flex h-[var(--control-md)] w-[var(--control-md)] shrink-0 items-center justify-center">
        {primaryCharacter?.avatarUrl ? (
          <img
            src={primaryCharacter.avatarUrl}
            alt=""
            className="h-8 w-8 rounded-[var(--radius-full)] object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-full)] bg-[var(--surface-3)] font-display text-[length:var(--text-ui)] text-[var(--gold-ornament)]"
          >
            {initial}
          </span>
        )}
      </span>

      <h1 className="min-w-0 flex-1 truncate font-display text-[length:var(--text-lead)] leading-[var(--lh-lead)] text-[var(--ink)]">
        {title}
      </h1>

      <button
        type="button"
        onClick={() => onOpenStoryList?.()}
        aria-label="Open story list"
        title="Stories"
        className={BARE_ICON_BUTTON_CLASS}
      >
        <RailPanelGlyph side="left" open={false} />
      </button>

      <button
        type="button"
        onClick={() => onOpenDetails?.()}
        aria-label="Story details"
        title="Story details"
        className={BARE_ICON_BUTTON_CLASS}
      >
        <Settings size={20} aria-hidden="true" />
      </button>
    </div>
  );
}

// One 44px toggle per rail (brief 2 item 5): the same glyph and recipe
// as the primary sidebar's collapse toggle, shared from RailPanelGlyph
// with the composer's mobile story list button (item 11). The glyph
// turns 180 degrees between open and closed (brief 3 item 3). The story
// list toggle anchors to the right edge of its panel and the details
// toggle to the left edge, so each sits against the center column open
// or closed.
function RailEdgeToggle({ side, open = false, onClick, openLabel, closeLabel }) {
  const label = open ? closeLabel : openLabel;

  return (
    <div
      className={`flex shrink-0 py-[var(--space-2)] ${
        side === "left" ? "justify-end" : "justify-start"
      }`}
    >
      <button
        type="button"
        onClick={() => onClick?.()}
        title={label}
        aria-label={label}
        aria-expanded={open}
        className={BARE_ICON_BUTTON_CLASS}
      >
        <RailPanelGlyph side={side} open={open} />
      </button>
    </div>
  );
}

function StoryRoomComposerHelpPanel({ panel, commands = [], onClose }) {
  const showCommands = panel === "COMMANDS";
  const showFormat = panel === "FORMAT";

  return (
    <KitModalFrame
      onClose={onClose}
      ariaLabelledBy="story-room-composer-help-title"
      panelClassName="w-full max-w-2xl p-5 sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={EYEBROW_CLASS}>Story composer</p>
          <h2
            id="story-room-composer-help-title"
            className="mt-[var(--space-2)] font-display text-[length:var(--text-subhead)] leading-[var(--lh-subhead)] text-[var(--ink)]"
          >
            {showCommands
              ? "Available commands"
              : showFormat
                ? "Story text formatting"
                : "Quick help"}
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
              {command.sourceLabel ? (
                <p className="mt-2 text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-dim)]">
                  {command.sourceLabel}
                  {command.ambiguous ? " · Multiple active definitions" : ""}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      ) : showFormat ? (
        <div className="mt-5 grid gap-3">
          <div className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] p-4">
            <p className="text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
              Crestfall recognizes common roleplay writing styles automatically. Your original text is preserved; formatting helps the Story understand what is spoken, acted, thought, written, or transmitted mentally.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <FormatHelpItem label="Dialogue" example={'"Do not touch that."'}>
              Put spoken dialogue in quotation marks. When you use quoted dialogue, ordinary unquoted prose in the same turn is treated as action.
            </FormatHelpItem>
            <FormatHelpItem label="Action" example="I take one step back.">
              With quote-style roleplay, plain prose is action. If you prefer the asterisk-action style, *action like this* is also supported.
            </FormatHelpItem>
            <FormatHelpItem label="Private thought" example="*Why is that ticking?*">
              In quote-style roleplay, italicized text is private inner thought. Ordinary Characters do not receive private thoughts unless explicit perception authority allows it.
            </FormatHelpItem>
            <FormatHelpItem label="Written or digital message" example="> Meet me behind the station.">
              Begin a line with &gt; for a written, physical, or digital message.
            </FormatHelpItem>
            <FormatHelpItem label="Telepathy" example={'`Can you hear me?`'}>
              Wrap deliberately transmitted mental speech in backticks. Telepathy is distinct from a private inner thought and remains subject to recipient/perception rules.
            </FormatHelpItem>
            <FormatHelpItem label="Alternate roleplay style" example="*She steps closer.*  Hello there.">
              If you use asterisks for actions and do not use quoted dialogue, ordinary unwrapped text is treated as spoken dialogue.
            </FormatHelpItem>
          </div>

          <p className="text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
            Tip: use /commands to see all available Story commands. /format is local help only: it does not advance the Story or send a message to Characters.
          </p>
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

function FormatHelpItem({ label, example, children }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] p-4">
      <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
        {label}
      </p>
      <p className="mt-2 rounded-[var(--radius-sm)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-3 py-2 font-mono text-[length:var(--text-body)] text-[var(--ink)]">
        {example}
      </p>
      <p className="mt-3 text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
        {children}
      </p>
    </div>
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
