"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Circle,
  Clock3,
  ExternalLink,
  Globe2,
  Info,
  LoaderCircle,
  LockKeyhole,
  RefreshCw,
  Send,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import { SectionTitle } from "@/components/studio/my-creations/edit/sections/SharedFields";

const STATUS_PRESENTATION = {
  QUEUED: {
    label: "Queued",
    className: "border-sky-300/25 bg-sky-300/10 text-sky-100",
  },
  VALIDATING: {
    label: "Validating",
    className: "border-sky-300/25 bg-sky-300/10 text-sky-100",
  },
  CANCELLING: {
    label: "Cancelling",
    className: "border-amber-300/25 bg-amber-300/10 text-amber-100",
  },
  PASSED: {
    label: "Passed",
    className: "border-emerald-300/25 bg-emerald-300/10 text-emerald-100",
  },
  NEEDS_CHANGES: {
    label: "Needs changes",
    className: "border-amber-300/25 bg-amber-300/10 text-amber-100",
  },
  FAILED: {
    label: "Failed",
    className: "border-red-300/25 bg-red-300/10 text-red-100",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "border-white/15 bg-white/5 text-[var(--ink-dim)]",
  },
};

function normalizeStatus(value) {
  return typeof value === "string" ? value.trim().toUpperCase() : "";
}

function formatDate(value) {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return date.toLocaleString();
}

function StatusPill({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/25 px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
        {label}
      </p>
      <p className="mt-1 text-sm text-[var(--ink)]">{value}</p>
    </div>
  );
}

function ValidationStatusBadge({ status }) {
  const normalized = normalizeStatus(status);
  const presentation = STATUS_PRESENTATION[normalized] || {
    label: normalized || "Not submitted",
    className: "border-white/15 bg-white/5 text-[var(--ink-dim)]",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] ${presentation.className}`}
    >
      {presentation.label}
    </span>
  );
}

function ReadinessCheck({ check }) {
  const Icon = check.complete ? CheckCircle2 : check.required ? AlertTriangle : Circle;
  const iconClass = check.complete
    ? "text-emerald-300"
    : check.required
      ? "text-amber-200"
      : "text-[var(--ink-dim)]";

  return (
    <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/20 p-4">
      <Icon size={18} className={`mt-0.5 shrink-0 ${iconClass}`} />
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm text-[var(--ink)]">{check.label}</p>
          {!check.required ? (
            <span className="rounded-full border border-white/10 px-2 py-0.5 text-[9px] uppercase tracking-[0.16em] text-[var(--ink-dim)]">
              Recommended
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-xs leading-5 text-[var(--ink-dim)]">{check.detail}</p>
      </div>
    </div>
  );
}

function IssueList({ title, issues, hiddenCount = 0, tone = "warning" }) {
  if (!issues.length && !hiddenCount) return null;

  const isError = tone === "error";

  return (
    <div
      className={`rounded-[var(--radius-md)] border p-5 ${
        isError
          ? "border-red-300/20 bg-red-300/5"
          : "border-amber-300/20 bg-amber-300/5"
      }`}
    >
      <div className="flex items-center gap-2">
        <AlertTriangle
          size={17}
          className={isError ? "text-red-200" : "text-amber-200"}
        />
        <h3 className="text-sm uppercase tracking-[0.18em] text-[var(--ink)]">
          {title}
        </h3>
      </div>

      <div className="mt-4 grid gap-3">
        {issues.map((item, index) => (
          <div
            key={`${item.code}-${item.path}-${index}`}
            className="rounded-xl border border-white/10 bg-black/20 px-4 py-3"
          >
            <p className="text-sm text-[var(--ink)]">{item.message}</p>
            <p className="mt-1 break-all font-mono text-[10px] text-[var(--ink-dim)]">
              {item.path}
            </p>
          </div>
        ))}
      </div>

      {hiddenCount ? (
        <p className="mt-4 text-xs text-[var(--ink-dim)]">
          {hiddenCount} additional issue{hiddenCount === 1 ? "" : "s"} not shown.
        </p>
      ) : null}
    </div>
  );
}

function ValidationProgress({ submission }) {
  const total = Number(submission?.totalChunks || 0);
  const completed = Number(submission?.completedChunks || 0);
  const percentage = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;

  return (
    <div className="mt-5">
      <div className="flex items-center justify-between gap-3 text-xs text-[var(--ink-dim)]">
        <span>
          {completed} of {total} validation segments complete
        </span>
        <span>{percentage}%</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-[var(--gold-ornament)] transition-[width] duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function ValidationHistory({ submissions = [] }) {
  if (!submissions.length) return null;

  return (
    <div className="mt-6 border-t border-white/10 pt-5">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
        Recent submissions
      </p>
      <div className="mt-3 grid gap-2">
        {submissions.slice(0, 5).map((submission) => (
          <div
            key={submission.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3"
          >
            <div>
              <p className="text-sm text-[var(--ink)]">
                {formatDate(submission.createdAt)}
              </p>
              <p className="mt-1 text-xs text-[var(--ink-dim)]">
                {submission.completedChunks || 0} / {submission.totalChunks || 0} segments complete
              </p>
            </div>
            <ValidationStatusBadge status={submission.status} />
          </div>
        ))}
      </div>
    </div>
  );
}

function SecurityValidationPanel({
  isAuthoringReady,
  hasUnsavedChanges,
  latestValidation,
  validationSubmissions,
  validationLoadStatus,
  validationLoadMessage,
  validationActionStatus,
  validationActionMessage,
  isValidationActive,
  canSubmitValidation,
  canCancelValidation,
  submitValidation,
  cancelValidation,
  refreshValidation,
}) {
  const latestStatus = normalizeStatus(latestValidation?.status);
  const reasons = Array.isArray(latestValidation?.resultSummary?.publicReasons)
    ? latestValidation.resultSummary.publicReasons
    : [];

  return (
    <div className="mt-6 rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/25 bg-black/25 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
            Security validation
          </p>
          <h3 className="mt-2 font-display text-3xl">Submit the saved Lore revision</h3>
          <p className="mt-3 leading-7 text-[var(--ink-dim)]">
            Submission freezes the last saved Lore draft into an immutable validation snapshot. The validation queue may take time when the service is busy. You can cancel an active submission and submit the saved draft again after cancellation or failure.
          </p>
          <p className="mt-2 text-sm text-[var(--ink-dim)]">
            Unsaved editor changes are not included. Passing validation does not publish the Lore Asset yet.
          </p>
        </div>

        <button
          type="button"
          onClick={refreshValidation}
          disabled={validationLoadStatus === "LOADING"}
          className="cf-btn cf-btn--secondary cf-btn--sm"
        >
          <RefreshCw
            size={13}
            className={validationLoadStatus === "LOADING" ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {hasUnsavedChanges ? (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-300/25 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
          <AlertTriangle size={17} className="mt-0.5 shrink-0" />
          <p>
            Save the current Lore changes before submitting another validation snapshot.
            Validation always freezes the last successfully saved revision.
          </p>
        </div>
      ) : null}

      {validationLoadMessage ? (
        <div className="mt-4 rounded-xl border border-red-300/20 bg-red-300/5 px-4 py-3 text-sm text-red-100">
          {validationLoadMessage}
        </div>
      ) : null}

      {latestValidation ? (
        <div className="mt-5 rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--ink-dim)]">
                Latest validation
              </p>
              <p className="mt-2 text-sm text-[var(--ink)]">
                Submitted {formatDate(latestValidation.createdAt)}
              </p>
            </div>
            <ValidationStatusBadge status={latestValidation.status} />
          </div>

          {isValidationActive ? <ValidationProgress submission={latestValidation} /> : null}

          {latestStatus === "PASSED" ? (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-emerald-300/20 bg-emerald-300/5 p-4">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-200" />
              <p className="text-sm leading-6 text-emerald-50">
                This saved revision passed security validation. It is eligible for the public-release action below.
              </p>
            </div>
          ) : null}

          {latestStatus === "NEEDS_CHANGES" ? (
            <div className="mt-4 rounded-xl border border-amber-300/20 bg-amber-300/5 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-200" />
                <div>
                  <p className="text-sm text-amber-50">
                    This revision needs changes before it can pass validation.
                  </p>
                  {reasons.length ? (
                    <ul className="mt-3 space-y-1 text-sm text-amber-100/80">
                      {reasons.map((reason) => (
                        <li key={reason}>• {reason}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}

          {latestStatus === "FAILED" ? (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-300/20 bg-red-300/5 p-4">
              <XCircle size={18} className="mt-0.5 shrink-0 text-red-200" />
              <div>
                <p className="text-sm text-red-50">Validation could not complete.</p>
                {latestValidation.errorMessage ? (
                  <p className="mt-1 text-xs leading-5 text-red-100/75">
                    {latestValidation.errorMessage}
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}

          {latestStatus === "CANCELLED" ? (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
              <Clock3 size={18} className="mt-0.5 shrink-0 text-[var(--ink-dim)]" />
              <p className="text-sm text-[var(--ink-dim)]">
                This validation submission was cancelled. The saved Lore draft can be submitted again.
              </p>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-dashed border-white/15 bg-black/15 px-4 py-5 text-sm text-[var(--ink-dim)]">
          This Lore Asset has not been submitted for security validation.
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={submitValidation}
          disabled={!canSubmitValidation}
          className="cf-btn cf-btn--primary"
        >
          {validationActionStatus === "WORKING" && !isValidationActive ? (
            <LoaderCircle size={14} className="animate-spin" />
          ) : (
            <Send size={14} />
          )}
          {latestValidation && !isValidationActive
            ? "Submit saved draft again"
            : "Submit for validation"}
        </button>

        {canCancelValidation ? (
          <button
            type="button"
            onClick={cancelValidation}
            className="cf-btn cf-btn--danger"
          >
            <XCircle size={14} />
            Cancel validation
          </button>
        ) : null}

        {hasUnsavedChanges ? (
          <p className="text-xs text-amber-100">
            Save this Lore Asset before submitting it for validation.
          </p>
        ) : !isAuthoringReady ? (
          <p className="text-xs text-amber-100">
            Complete all required authoring checks before submitting.
          </p>
        ) : null}
      </div>

      {validationActionMessage ? (
        <p
          className={`mt-3 text-sm ${
            validationActionStatus === "ERROR" ? "text-red-200" : "text-emerald-200"
          }`}
        >
          {validationActionMessage}
        </p>
      ) : null}

      <ValidationHistory submissions={validationSubmissions} />
    </div>
  );
}

function PublicReleasePanel({
  activePublication,
  publishableValidation,
  publicHref,
  publicationActionStatus,
  publicationActionMessage,
  canPublishValidatedRevision,
  publishValidatedRevision,
  LinkComponent,
}) {
  const revisionNumber = Number(activePublication?.revisionNumber || 0);

  return (
    <div className="mt-6 rounded-[var(--radius-md)] border border-emerald-300/20 bg-emerald-300/[0.04] p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-emerald-200">
            <Globe2 size={18} />
            <p className="text-xs uppercase tracking-[0.2em]">Public release</p>
          </div>
          <h3 className="mt-2 font-display text-3xl">Publish a validated revision</h3>
          <p className="mt-3 leading-7 text-[var(--ink-dim)]">
            Public release uses the immutable snapshot that passed validation. Editing or saving the working Lore draft does not alter the currently published revision.
          </p>
        </div>

        {activePublication && publicHref ? (
          <LinkComponent
            href={publicHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-300/25 bg-emerald-300/5 px-4 py-3 text-xs uppercase tracking-[0.16em] text-emerald-100 transition hover:border-emerald-300/45 hover:bg-emerald-300/10"
          >
            <ExternalLink size={14} />
            View public Lore
          </LinkComponent>
        ) : null}
      </div>

      {activePublication ? (
        <div className="mt-5 rounded-xl border border-emerald-300/20 bg-black/20 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-emerald-200">
                Active public revision
              </p>
              <p className="mt-2 text-sm text-[var(--ink)]">
                Revision {revisionNumber || "·"} · Published {formatDate(activePublication.publishedAt)}
              </p>
            </div>
            <span className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-emerald-100">
              Public
            </span>
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-dashed border-white/15 bg-black/15 px-4 py-5 text-sm text-[var(--ink-dim)]">
          This Lore Asset does not have a public revision yet.
        </div>
      )}

      {publishableValidation ? (
        <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
            Ready to publish
          </p>
          <p className="mt-2 text-sm text-[var(--ink)]">
            Validated {formatDate(publishableValidation.completedAt || publishableValidation.createdAt)}
          </p>
          <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">
            The published page will use this validated snapshot, not any newer saved or unsaved draft changes.
          </p>

          <button
            type="button"
            onClick={publishValidatedRevision}
            disabled={!canPublishValidatedRevision}
            className="cf-btn cf-btn--primary mt-4"
          >
            {publicationActionStatus === "WORKING" ? (
              <LoaderCircle size={14} className="animate-spin" />
            ) : (
              <Globe2 size={14} />
            )}
            Publish validated revision
          </button>
        </div>
      ) : activePublication ? (
        <p className="mt-5 text-sm text-[var(--ink-dim)]">
          No newer validated revision is waiting to replace the active public revision.
        </p>
      ) : (
        <p className="mt-5 text-sm text-[var(--ink-dim)]">
          A Lore revision must pass security validation before it can be published.
        </p>
      )}

      {publicationActionMessage ? (
        <p
          className={`mt-3 text-sm ${
            publicationActionStatus === "ERROR"
              ? "text-red-200"
              : "text-emerald-200"
          }`}
        >
          {publicationActionMessage}
        </p>
      ) : null}

      <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-6 text-[var(--ink-dim)]">
        Publishing does not make this Lore available for character use. That remains a separate voluntary workflow.
      </p>
    </div>
  );
}

export default function LorePublicationReadinessView({
  checks = [],
  completedCheckCount = 0,
  totalCheckCount = 0,
  completedRequiredCount = 0,
  requiredCheckCount = 0,
  isAuthoringReady = false,
  hasUnsavedChanges = false,
  errors = [],
  warnings = [],
  hiddenErrorCount = 0,
  hiddenWarningCount = 0,
  summary = {},
  lifecycleStatus = "DRAFT",
  visibility = "PRIVATE",
  publicReleaseStatus = "NOT PUBLISHED",
  contentRating = "SFW",
  ownerPreviewHref = "",
  LinkComponent = "a",
  validationSubmissions = [],
  latestValidation = null,
  validationLoadStatus = "IDLE",
  validationLoadMessage = "",
  validationActionStatus = "IDLE",
  validationActionMessage = "",
  publicationActionStatus = "IDLE",
  publicationActionMessage = "",
  isValidationActive = false,
  activePublication = null,
  publishableValidation = null,
  publicHref = "",
  engineUsePanel = null,
  canSubmitValidation = false,
  canCancelValidation = false,
  canPublishValidatedRevision = false,
  submitValidation,
  cancelValidation,
  publishValidatedRevision,
  refreshValidation,
}) {
  return (
    <div>
      <SectionTitle
        eyebrow="Lore Publishing"
        title="Publication Readiness"
        body="Review the saved Lore draft, submit it to the security-validation queue, and publish only an immutable revision that has passed validation."
      />

      <div className="mt-7 rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/30 bg-[var(--gold-ornament)]/5 p-5">
        <div className="flex items-start gap-3">
          <LockKeyhole size={22} className="mt-0.5 shrink-0 text-[var(--gold-ornament)]" />
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
              Validated release boundary
            </p>
            <h3 className="mt-2 font-display text-3xl">Draft and public revisions stay separate</h3>
            <p className="mt-3 max-w-4xl leading-7 text-[var(--ink-dim)]">
              Validation freezes the last saved revision and checks it without changing the editable Lore draft. Publishing activates only that passed snapshot. Later edits remain private until a newer revision is validated and explicitly published.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <StatusPill label="Lifecycle" value={lifecycleStatus} />
        <StatusPill label="Draft Visibility" value={visibility} />
        <StatusPill label="Public Release" value={publicReleaseStatus} />
        <StatusPill label="Content Rating" value={contentRating} />
        <StatusPill
          label="Current Structure"
          value={`${summary.chapterCount || 0} chapters · ${summary.sectionCount || 0} sections · ${summary.blockCount || 0} blocks`}
        />
      </div>

      <SecurityValidationPanel
        isAuthoringReady={isAuthoringReady}
        hasUnsavedChanges={hasUnsavedChanges}
        latestValidation={latestValidation}
        validationSubmissions={validationSubmissions}
        validationLoadStatus={validationLoadStatus}
        validationLoadMessage={validationLoadMessage}
        validationActionStatus={validationActionStatus}
        validationActionMessage={validationActionMessage}
        isValidationActive={isValidationActive}
        canSubmitValidation={canSubmitValidation}
        canCancelValidation={canCancelValidation}
        submitValidation={submitValidation}
        cancelValidation={cancelValidation}
        refreshValidation={refreshValidation}
      />

      <PublicReleasePanel
        activePublication={activePublication}
        publishableValidation={publishableValidation}
        publicHref={publicHref}
        publicationActionStatus={publicationActionStatus}
        publicationActionMessage={publicationActionMessage}
        canPublishValidatedRevision={canPublishValidatedRevision}
        publishValidatedRevision={publishValidatedRevision}
        LinkComponent={LinkComponent}
      />

      {engineUsePanel}

      <div className="mt-8 grid gap-5 xl:grid-cols-[1fr_0.42fr]">
        <div className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
                Authoring checklist
              </p>
              <h3 className="mt-2 font-display text-3xl">
                {completedCheckCount} of {totalCheckCount} checks complete
              </h3>
              <p className="mt-2 text-sm text-[var(--ink-dim)]">
                {completedRequiredCount} of {requiredCheckCount} required checks complete.
              </p>
            </div>

            <div
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[10px] uppercase tracking-[0.16em] ${
                isAuthoringReady
                  ? "border-emerald-300/25 bg-emerald-300/10 text-emerald-200"
                  : "border-amber-300/25 bg-amber-300/10 text-amber-100"
              }`}
            >
              {isAuthoringReady ? <ShieldCheck size={14} /> : <AlertTriangle size={14} />}
              {isAuthoringReady
                ? "Ready to submit"
                : "Authoring blockers remain"}
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {checks.map((check) => (
              <ReadinessCheck key={check.id} check={check} />
            ))}
          </div>
        </div>

        <aside className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-5">
          <Info size={20} className="text-[var(--gold-ornament)]" />
          <h3 className="mt-3 font-display text-3xl">Owner verification</h3>
          <p className="mt-3 leading-7 text-[var(--ink-dim)]">
            Review the last saved draft in the full reader before submitting it. Unsaved editor changes do not appear there and are not included in validation.
          </p>

          {ownerPreviewHref ? (
            <LinkComponent
              href={ownerPreviewHref}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[var(--gold-ornament)]/30 bg-[var(--gold-ornament)]/5 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--gold-ornament)] transition hover:border-[var(--gold-ornament)]/55 hover:text-[var(--ink)]"
            >
              <ExternalLink size={14} />
              Open full owner preview
            </LinkComponent>
          ) : null}

          <div className="mt-6 border-t border-white/10 pt-5 text-xs leading-6 text-[var(--ink-dim)]">
            <p>Passing validation makes a frozen revision eligible for publication.</p>
            <p className="mt-2">Public release and character-use submission remain separate workflows.</p>
          </div>
        </aside>
      </div>

      <div className="mt-6 grid gap-5">
        <IssueList
          title="Blocking validation issues"
          issues={errors}
          hiddenCount={hiddenErrorCount}
          tone="error"
        />
        <IssueList
          title="Validation warnings"
          issues={warnings}
          hiddenCount={hiddenWarningCount}
        />
      </div>
    </div>
  );
}
