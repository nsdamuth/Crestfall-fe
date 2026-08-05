import {
  Command,
  HelpCircle,
  Keyboard,
  MapPin,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  X,
} from "lucide-react";

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
  runtimeMechanicsPanelProps = {},
  onToggleLeftPanel,
  onToggleRightPanel,
  onShowLeftPanel,
  onShowRightPanel,
  onCloseMobilePanel,
  onCloseComposerHelpPanel,
  CastPanelComponent,
  ComposerComponent,
  MobileDrawerComponent,
  RuntimeMechanicsPanelComponent,
  StatePanelComponent,
  TranscriptComponent,
}) {
  return (
    <section className="flex h-[calc(100dvh-7rem)] min-h-0 flex-col overflow-hidden xl:h-[calc(100vh-7rem)]">
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

        <main className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-[var(--gold-ornament)]/20 bg-black/45">
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
              {RuntimeMechanicsPanelComponent ? (
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
          onClose={onCloseMobilePanel}
        >
          {StatePanelComponent ? (
            <StatePanelComponent {...mobileStatePanelProps} />
          ) : null}
          {RuntimeMechanicsPanelComponent ? (
            <RuntimeMechanicsPanelComponent
              {...runtimeMechanicsPanelProps}
            />
          ) : null}
        </MobileDrawerComponent>
      ) : null}
    </section>
  );
}

function StoryRoomComposerHelpPanel({ panel, commands = [], onClose }) {
  const showCommands = panel === "COMMANDS";

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="story-room-composer-help-title"
        className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[var(--gold-ornament)]/35 bg-[#080706] p-5 shadow-2xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
              Story Room Composer
            </p>
            <h2
              id="story-room-composer-help-title"
              className="mt-2 font-display text-2xl text-[var(--ink)]"
            >
              {showCommands ? "Available Commands" : "Quick Help"}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onClose?.()}
            className="rounded-lg border border-white/10 p-2 text-[var(--ink-dim)] transition hover:text-[var(--ink)]"
            aria-label="Close composer help"
          >
            <X size={16} />
          </button>
        </div>

        {showCommands ? (
          <div className="mt-5 grid gap-3">
            {commands.map((command) => (
              <div
                key={command.name}
                className="rounded-xl border border-white/10 bg-black/30 p-4"
              >
                <p className="font-mono text-sm text-[var(--gold-ornament)]">
                  {command.usage}
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
                  {command.description}
                </p>
                {command.aliases?.length ? (
                  <p className="mt-2 text-xs text-[var(--ink-dim)]">
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
      </div>
    </div>
  );
}

function ComposerHelpItem({ icon: Icon, title, children }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-4">
      <div className="flex items-center gap-2 text-[var(--gold-ornament)]">
        <Icon size={16} />
        <p className="text-xs uppercase tracking-[0.14em]">{title}</p>
      </div>
      <p className="mt-3 text-sm leading-6 text-[var(--ink-dim)]">{children}</p>
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
    <div className="hidden shrink-0 border-b border-white/10 p-5 xl:block">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold-ornament)]">
            Story
          </p>

          <h1 className="mt-2 font-display text-4xl">
            {room?.title}
          </h1>

          <p className="mt-2 text-sm text-[var(--ink-dim)]">
            {room?.scenario} · {room?.roomMode}
          </p>
        </div>

        <div className="flex flex-col gap-2 lg:items-end">
          <div className="hidden flex-wrap justify-end gap-2 xl:flex">
            <button
              type="button"
              onClick={() => onToggleLeftPanel?.()}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs uppercase tracking-[0.14em] transition ${
                leftOpen
                  ? "border-[var(--gold-ornament)]/55 bg-[var(--gold-ornament)]/15 text-[var(--ink)]"
                  : "border-white/10 bg-black/30 text-[var(--ink-dim)] hover:border-[var(--gold-ornament)]/35 hover:text-[var(--ink)]"
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
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs uppercase tracking-[0.14em] transition ${
                rightOpen
                  ? "border-[var(--gold-ornament)]/55 bg-[var(--gold-ornament)]/15 text-[var(--ink)]"
                  : "border-white/10 bg-black/30 text-[var(--ink-dim)] hover:border-[var(--gold-ornament)]/35 hover:text-[var(--ink)]"
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
        className="flex h-12 w-11 items-center justify-center rounded-2xl border border-[var(--gold-ornament)]/25 bg-[var(--gold-ornament)]/10 text-[var(--gold-ornament)] transition hover:bg-[var(--gold-ornament)]/20 hover:text-[var(--ink)]"
      >
        <Icon size={16} />
      </button>
    </div>
  );
}

function StatusPill({ children }) {
  return (
    <span className="whitespace-nowrap rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--ink-dim)]">
      {children}
    </span>
  );
}
