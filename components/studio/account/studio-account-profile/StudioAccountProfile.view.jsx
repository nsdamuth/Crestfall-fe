"use client";

import CrestfallSelect from "@/components/ui/CrestfallSelect";
import KitModalFrame from "@/components/kit/KitModalFrame";

export default function StudioAccountProfileView({
  isLoading,
  isSaving,
  loadErrorMessage,
  saveErrorMessage,
  statusMessage,
  profileInitial,
  profileUsername,
  userEmail,
  hasPublicProfile,
  publicProfileHref,
  fields,
  defaultPlayerCharacter,
  hasDefaultPlayerCharacter,
  hasDefaultPlayerCharacterSelection,
  isContentPreferenceNoticeOpen,
  contentPreferenceNoticeLabel,
  profileMediaContent,
  accountMetricsContent,
  onSubmit,
  onUsernameChange,
  onDisplayNameChange,
  onContactEmailChange,
  onTaglineChange,
  onDescriptionChange,
  onAnnouncementChange,
  onContentPreferenceChange,
  onCloseContentPreferenceNotice,
  onOpenDefaultPlayerCharacterPicker,
  onClearDefaultPlayerCharacter,
}) {
  if (isLoading) {
    return (
      <div className="rounded-[var(--radius-md)] border border-white/10 bg-black/30 p-4 text-sm text-[var(--ink-dim)]">
        Loading profile…
      </div>
    );
  }

  if (loadErrorMessage) {
    return (
      <div className="rounded-[var(--radius-md)] border border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] p-4 text-sm text-[var(--status-danger)]">
        {loadErrorMessage}
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/45 p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[var(--gold-ornament)]/30 bg-[var(--gold-ornament)]/10 font-display text-2xl text-[var(--gold-ornament)]">
            {profileInitial}
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-[var(--gold-ornament)]">
              Crestfall Creator
            </p>

            <h2 className="mt-1 font-display text-3xl">@{profileUsername}</h2>

            <p className="mt-1 text-sm text-[var(--ink-dim)]">
              {userEmail || "No email loaded"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {publicProfileHref ? (
            <a
              href={publicProfileHref}
              className="cf-btn cf-btn--secondary"
            >
              View public profile
            </a>
          ) : null}

          <SaveButton isSaving={isSaving} />
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="space-y-5">
          {hasPublicProfile ? (
            profileMediaContent
          ) : (
            <div className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-4 text-sm leading-6 text-[var(--ink-dim)]">
              Set a username to enable your public profile page and profile
              media controls.
            </div>
          )}

          {accountMetricsContent}
        </section>

        <section className="grid gap-5">
          <div className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
              Account Contact
            </p>

            <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
              Your login email comes from Google/Supabase and is used for
              account authentication. Contact email is only for support, account
              problems, billing contact, bug reports, and important account
              notices.
            </p>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <ReadOnlyValue
                label="Login Email"
                value={userEmail || "No login email loaded"}
                note="Read-only here. This does not change your Google login."
              />

              <LabeledInput
                label="Contact Email"
                type="email"
                {...fields.contactEmail}
                onChange={onContactEmailChange}
                note="Only changes where Crestfall can contact you."
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <LabeledInput
              label="Username"
              {...fields.username}
              onChange={onUsernameChange}
            />

            <LabeledInput
              label="Display Name"
              {...fields.displayName}
              onChange={onDisplayNameChange}
            />

            <div className="md:col-span-2">
              <CrestfallSelect
                label="Content Preference"
                value={fields.contentPreference.value}
                onChange={onContentPreferenceChange}
                options={fields.contentPreference.options}
                description="Native/mobile experiences should remain SFW-only. Mature and explicit access will require age verification before they become active."
              />
            </div>

            <div className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
                Default Player Character
              </p>

              <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
                Your preferred player identity for new story rooms. Other users
                may view public Player Characters, but only you can use your own
                PCs as playable identities.
              </p>

              {hasDefaultPlayerCharacter ? (
                <DefaultPlayerCharacterCard
                  playerCharacter={defaultPlayerCharacter}
                />
              ) : (
                <p className="mt-4 rounded-[var(--radius-md)] border border-dashed border-white/10 bg-black/25 p-4 text-sm leading-6 text-[var(--ink-dim)]">
                  No default Player Character selected.
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={onOpenDefaultPlayerCharacterPicker}
                  className="cf-btn cf-btn--secondary"
                >
                  Choose default PC
                </button>

                {hasDefaultPlayerCharacterSelection ? (
                  <button
                    type="button"
                    onClick={onClearDefaultPlayerCharacter}
                    className="cf-btn cf-btn--danger"
                  >
                    Clear
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-5">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold-ornament)]">
          Public Profile Text
        </p>

        <div className="mt-5 grid gap-4 xl:grid-cols-3">
          <LabeledTextarea
            label="Tagline"
            rows={5}
            {...fields.tagline}
            onChange={onTaglineChange}
          />

          <LabeledTextarea
            label="Description"
            rows={5}
            {...fields.description}
            onChange={onDescriptionChange}
          />

          <LabeledTextarea
            label="Announcement"
            rows={5}
            {...fields.announcement}
            onChange={onAnnouncementChange}
          />
        </div>
      </section>

      {saveErrorMessage ? (
        <div className="mt-5 rounded-[var(--radius-md)] border border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] p-3 text-sm text-[var(--status-danger)]">
          {saveErrorMessage}
        </div>
      ) : null}

      {statusMessage ? (
        <div className="mt-5 rounded-[var(--radius-md)] border border-[var(--status-success-border)] bg-[var(--status-success-bed)] p-3 text-sm text-[var(--status-success)]">
          {statusMessage}
        </div>
      ) : null}

      <div className="mt-6 flex justify-end">
        <SaveButton isSaving={isSaving} />
      </div>

      {isContentPreferenceNoticeOpen ? (
        <ContentPreferenceNoticeModal
          requestedRatingLabel={contentPreferenceNoticeLabel}
          onClose={onCloseContentPreferenceNotice}
        />
      ) : null}
    </form>
  );
}

function SaveButton({ isSaving }) {
  return (
    <button
      type="submit"
      disabled={isSaving}
      className="cf-btn cf-btn--primary"
    >
      {isSaving ? "Saving…" : "Save profile"}
    </button>
  );
}

function DefaultPlayerCharacterCard({ playerCharacter }) {
  return (
    <div className="mt-4 flex items-start gap-4 rounded-[var(--radius-md)] border border-white/10 bg-black/35 p-4">
      {playerCharacter.imageUrl ? (
        <div
          className="h-16 w-16 shrink-0 rounded-[var(--radius-md)] border border-white/10 bg-cover bg-center"
          style={{ backgroundImage: `url(${playerCharacter.imageUrl})` }}
        />
      ) : (
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/25 bg-[var(--gold-ornament)]/10 font-display text-2xl text-[var(--gold-ornament)]">
          {playerCharacter.title?.slice(0, 1).toUpperCase() || "P"}
        </div>
      )}

      <div className="min-w-0">
        <p className="font-display text-2xl">{playerCharacter.title}</p>
        <p className="mt-1 line-clamp-2 text-sm leading-6 text-[var(--ink-dim)]">
          {playerCharacter.description || "No description."}
        </p>
        <p className="mt-2 break-all text-[11px] uppercase tracking-[0.12em] text-[var(--ink-dim)]">
          {playerCharacter.id}
        </p>
      </div>
    </div>
  );
}

function LabeledInput({
  label,
  value,
  onChange,
  count,
  note,
  type = "text",
  maxLength,
  placeholder,
}) {
  return (
    <label className="block">
      <FieldLabel label={label} count={count} />
      <input
        type={type}
        maxLength={maxLength}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-[var(--radius-md)] border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50"
      />
      {note ? (
        <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">{note}</p>
      ) : null}
    </label>
  );
}

function LabeledTextarea({
  label,
  value,
  onChange,
  count,
  maxLength,
  placeholder,
  rows = 4,
}) {
  return (
    <label className="block">
      <FieldLabel label={label} count={count} />
      <textarea
        maxLength={maxLength}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="mt-2 w-full resize-none rounded-[var(--radius-md)] border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50"
      />
    </label>
  );
}

function FieldLabel({ label, count }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
        {label}
      </span>
      {count ? (
        <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--ink-dim)]">
          {count}
        </span>
      ) : null}
    </div>
  );
}

function ReadOnlyValue({ label, value, note }) {
  return (
    <div>
      <span className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
        {label}
      </span>
      <div className="mt-2 rounded-[var(--radius-md)] border border-white/10 bg-black/20 px-4 py-3 text-sm text-[var(--ink-dim)]">
        {value}
      </div>
      {note ? (
        <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">{note}</p>
      ) : null}
    </div>
  );
}

function ContentPreferenceNoticeModal({ requestedRatingLabel, onClose }) {
  return (
    <KitModalFrame
      onClose={onClose}
      ariaLabelledBy="studio-account-profile-content-preference-title"
      panelClassName="w-full max-w-md p-[var(--space-5)]"
    >
      <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
        Age Verification Required
      </p>
      <h2
        id="studio-account-profile-content-preference-title"
        className="mt-2 font-display text-3xl"
      >
        {requestedRatingLabel} Access Coming Soon
      </h2>

      <p className="mt-4 text-sm leading-7 text-[var(--ink-dim)]">
        Mature and explicit content preferences are not active yet. Before
        anything above SFW is supported, Crestfall will require age
        verification and additional account controls.
      </p>

      <p className="mt-3 text-sm leading-7 text-[var(--ink-dim)]">
        For now, your account will remain set to SFW Only.
      </p>

      <button
        type="button"
        onClick={onClose}
        className="cf-btn cf-btn--primary mt-5 w-full"
      >
        OK
      </button>
    </KitModalFrame>
  );
}
