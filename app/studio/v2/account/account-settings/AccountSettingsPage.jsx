import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3 } from "lucide-react";

import KitStudioPageView from "@/components/kit/studio-page/KitStudioPage.view";
import StudioPageHeaderView from "@/components/studio/studio-page-header/StudioPageHeader.view";

import { getAccountSettingsConfig } from "./accountSettingsConfig";

const STATUS_META = Object.freeze({
  LIVE: {
    label: "Live",
    Icon: CheckCircle2,
    className:
      "border-[var(--status-success-border)] bg-[var(--status-success-bed)] text-[var(--status-success)]",
  },
  NOT_CONNECTED: {
    label: "Not connected",
    Icon: Clock3,
    className:
      "border-[var(--line)] bg-[var(--fill-whisper)] text-[var(--ink-dim)]",
  },
});

export default function AccountSettingsPage({ settingsId }) {
  const config = getAccountSettingsConfig(settingsId);

  if (!config) return null;

  return (
    <KitStudioPageView
      headerSlot={
        <StudioPageHeaderView
          eyebrow={config.eyebrow}
          title={config.title}
          description={config.description}
        />
      }
    >
      <div>
        <Link
          href="/studio/v2/account"
          className="inline-flex min-h-[var(--control-sm)] items-center gap-[var(--space-2)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)] transition-colors hover:text-[var(--gold-bright)]"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to Account
        </Link>
      </div>

      <section className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-1)] p-[var(--space-5)]">
        <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
          Current capability
        </p>
        <h2 className="mt-[var(--space-2)] font-display text-[length:var(--text-heading)] leading-[var(--lh-heading)] text-[var(--ink)]">
          {config.summaryTitle}
        </h2>
        <p className="mt-[var(--space-3)] max-w-[var(--measure)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
          {config.summaryBody}
        </p>
      </section>

      <div className="grid gap-[var(--space-4)] min-[800px]:grid-cols-2">
        {config.capabilities.map((capability) => (
          <CapabilityCard key={capability.id} capability={capability} />
        ))}
      </div>

      <section className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-[var(--space-4)]">
        <p className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
          Account settings only become interactive when a real Crestfall persistence/runtime contract exists. This page does not use fixtures, local-only toggles, or disabled controls to imply settings are being saved.
        </p>
      </section>
    </KitStudioPageView>
  );
}

function CapabilityCard({ capability }) {
  const status = STATUS_META[capability.status] || STATUS_META.NOT_CONNECTED;
  const Icon = status.Icon;

  return (
    <article className="flex min-h-full flex-col rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-1)] p-[var(--space-5)]">
      <div className="flex items-start justify-between gap-[var(--space-3)]">
        <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
          {capability.label}
        </p>
        <span
          className={`inline-flex items-center gap-[var(--space-1)] rounded-[var(--radius-full)] border px-[var(--space-3)] py-[var(--space-1)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] ${status.className}`}
        >
          <Icon size={13} aria-hidden="true" />
          {status.label}
        </span>
      </div>

      <h2 className="mt-[var(--space-3)] font-display text-[length:var(--text-lead)] leading-[var(--lh-lead)] text-[var(--ink)]">
        {capability.title}
      </h2>
      <p className="mt-[var(--space-2)] flex-1 text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
        {capability.body}
      </p>

      {capability.href ? (
        <div className="mt-[var(--space-4)]">
          <Link
            href={capability.href}
            className="cf-btn cf-btn--secondary inline-flex items-center gap-[var(--space-2)]"
          >
            {capability.actionLabel || "Open live setting"}
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <p className="mt-[var(--space-4)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
          No saved account control yet
        </p>
      )}
    </article>
  );
}
