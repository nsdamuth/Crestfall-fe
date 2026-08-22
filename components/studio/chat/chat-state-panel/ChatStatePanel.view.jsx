"use client";

import { useState } from "react";
import {
  CloudSun,
  Download,
  Eye,
  Flag,
  Lock,
  PanelRightClose,
  Share2,
} from "lucide-react";

import KitModalFrame from "@/components/kit/KitModalFrame";

const SECTION_ICONS = {
  scenario: Flag,
  world: CloudSun,
  knowledge: Lock,
  memory: Eye,
};

const ACTION_ICONS = {
  download: Download,
  share: Share2,
};

function StatePanelContent({ eyebrow, title, sections, actions, showCloseControl, onClosePanel }) {
  const safeSections = Array.isArray(sections) ? sections : [];
  const safeActions = Array.isArray(actions) ? actions : [];

  return (
    <div>
      <div className="mb-[var(--space-4)] flex items-center justify-between gap-[var(--space-3)]">
        <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
          {eyebrow}
        </p>

        {showCloseControl ? (
          <button
            type="button"
            onClick={() => onClosePanel?.()}
            className="flex h-[var(--control-sm)] w-[var(--control-sm)] touch-manipulation items-center justify-center rounded-[var(--radius-md)] border border-[var(--line-whisper)] text-[var(--ink-dim)] transition hover:border-[var(--line)] hover:text-[var(--ink)] [@media(pointer:coarse)]:h-[var(--control-md)] [@media(pointer:coarse)]:w-[var(--control-md)]"
            aria-label="Hide state panel"
            title="Hide state panel"
          >
            <PanelRightClose size={15} aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <h2 className="mt-[var(--space-2)] font-display text-[length:var(--text-heading)] leading-[var(--lh-heading)]">
        {title}
      </h2>

      <div className="mt-[var(--space-6)] space-y-[var(--space-4)]">
        {safeSections.map((section) => (
          <StateCard key={section.id} section={section} />
        ))}
      </div>

      {safeActions.length ? (
        <div className="mt-[var(--space-6)] grid gap-[var(--space-3)]">
          {safeActions.map((action) => {
            const ActionIcon = ACTION_ICONS[action.iconKey] || Download;

            return (
              <button
                key={action.id}
                type="button"
                disabled={Boolean(action.disabled)}
                onClick={() => action.onPress?.()}
                className={`inline-flex min-h-[var(--control-md)] touch-manipulation items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] border px-[var(--space-4)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] transition ${
                  action.disabled
                    ? "cursor-not-allowed border-[var(--line-whisper)] text-[var(--ink-faint)] opacity-[var(--state-disabled-opacity)]"
                    : "border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--ink-dim)] hover:border-[var(--line)] hover:text-[var(--ink)]"
                }`}
              >
                <ActionIcon size={14} aria-hidden="true" />
                {action.label}
                {action.disabled ? (
                  <span className="normal-case tracking-normal text-[var(--ink-faint)]">Soon</span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default function ChatStatePanelView(props) {
  const { initialMobileOpen = false, ...contentProps } = props;
  const [mobileOpen, setMobileOpen] = useState(initialMobileOpen);

  return (
    <>
      <aside className="hidden self-start rounded-[var(--radius-lg)] border border-[var(--line-whisper)] bg-[var(--surface-3)] p-[var(--space-5)] xl:block">
        <StatePanelContent {...contentProps} />
      </aside>

      <div className="xl:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="inline-flex min-h-[var(--control-md)] touch-manipulation items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] px-[var(--space-4)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-dim)]"
        >
          <Eye size={14} aria-hidden="true" />
          Chronicle State
        </button>

        {mobileOpen ? (
          <KitModalFrame variant="sheet" onClose={() => setMobileOpen(false)} ariaLabel="Chronicle state">
            <div className="p-[var(--space-4)]">
              <StatePanelContent {...contentProps} showCloseControl={false} />
            </div>
          </KitModalFrame>
        ) : null}
      </div>
    </>
  );
}

function StateCard({ section }) {
  const Icon = SECTION_ICONS[section?.iconKey] || Flag;
  const rows = Array.isArray(section?.rows) ? section.rows : [];

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--line-whisper)] bg-[var(--surface-1)] p-[var(--space-4)]">
      <p className="inline-flex items-center gap-[var(--space-2)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
        <Icon size={14} aria-hidden="true" />
        {section?.title || "State"}
      </p>

      <div className="mt-[var(--space-3)] space-y-[var(--space-3)]">
        {rows.map((row) => (
          <div key={row.id}>
            <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
              {row.label}
            </p>
            <p className="mt-[var(--space-1)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)]">
              {row.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
