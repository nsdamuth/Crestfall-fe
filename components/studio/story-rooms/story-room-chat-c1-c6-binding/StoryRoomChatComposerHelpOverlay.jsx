"use client";

import { Command, HelpCircle, Keyboard, MapPin } from "lucide-react";

import KitModalFrame from "@/components/kit/KitModalFrame";

export default function StoryRoomChatComposerHelpOverlay({
  panel,
  commands = [],
  onClose,
}) {
  if (!panel) return null;
  const showCommands = panel === "COMMANDS";

  return (
    <KitModalFrame variant="modal" onClose={onClose} ariaLabel="Story Room composer help">
      <div className="p-[var(--space-5)]">
        <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
          Story Room Composer
        </p>
        <h2 className="mt-[var(--space-2)] font-display text-[length:var(--text-subhead)] leading-[var(--lh-subhead)] text-[var(--ink)]">
          {showCommands ? "Available Commands" : "Quick Help"}
        </h2>

        {showCommands ? (
          <div className="mt-[var(--space-5)] grid gap-[var(--space-3)]">
            {commands.map((command) => (
              <div key={command.name} className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] p-[var(--space-4)]">
                <p className="font-mono text-[length:var(--text-ui)] text-[var(--gold-ornament)]">{command.usage}</p>
                <p className="mt-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">{command.description}</p>
                {command.aliases?.length ? (
                  <p className="mt-[var(--space-2)] text-[length:var(--text-label)] text-[var(--ink-faint)]">
                    Alias: {command.aliases.map((alias) => `/${alias}`).join(", ")}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-[var(--space-5)] grid gap-[var(--space-3)] sm:grid-cols-2">
            <HelpItem icon={Keyboard} title="Send and format">Press Enter to send. Press Shift+Enter to add a new line.</HelpItem>
            <HelpItem icon={Command} title="Commands">Type / to begin a command. Use /commands for the complete list.</HelpItem>
            <HelpItem icon={HelpCircle} title="Open help">Use /? or /help whenever you need this guide again.</HelpItem>
            <HelpItem icon={MapPin} title="Locations">Type # to search and reference locations from the attached Location Registry.</HelpItem>
          </div>
        )}
      </div>
    </KitModalFrame>
  );
}

function HelpItem({ icon: Icon, title, children }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] p-[var(--space-4)]">
      <p className="inline-flex items-center gap-[var(--space-2)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
        <Icon size={14} aria-hidden="true" />
        {title}
      </p>
      <p className="mt-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">{children}</p>
    </div>
  );
}
