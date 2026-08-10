"use client";

// The Account draft, fixture-driven, presentation only. Rendered by
// /studio/v2/account (pre-parity staging address, OUTSIDE the ruled
// nine-page model per docs/APP-FUNCTION-INVENTORY.md pass C) and
// mirrored at /dev/ui-preview/account-v2-page. No sidebar entry
// anywhere. Per docs/SPRINT-D-PLAN.md section 4, amended by Brian's
// ratified A1 (drop the Canon stat) and informed by the A2 witness
// (crestfall-main UIUX branch design-system/proof/account.html,
// design intent only, no code imported, scope unchanged from the
// plan). The live account page and its components
// (app/studio/account/, components/studio/account/,
// components/studio/profile/) are READ ONLY reference and are never
// imported here. No live data, no API calls, no real navigation.
//
// The three defects the live page carries, fixed in this draft:
// (a) title collision: description passes through the header's
//     description prop, never as children;
// (b) stat duplication: ONE stats block, fetched once in the live
//     page's terms (here, fixture-fed once); the coins panel never
//     carries its own separate all-zero stat grid;
// (c) raw controls: every control resolves through cf-field, cf-btn,
//     KitDropdown, KitModalFrame, or the kit-search-input recipe.
import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, UserRound } from "lucide-react";

import KitStudioPageView from "@/components/kit/studio-page/KitStudioPage.view";
import StudioPageHeaderView from "@/components/studio/studio-page-header/StudioPageHeader.view";
import KitModalFrame from "@/components/kit/KitModalFrame";
import KitDropdown from "@/components/kit/KitDropdown";
import { CONTENT_RATING_TIERS } from "@/lib/shared/presentation/terminology";
import {
  USERNAME_MAX,
  DISPLAY_NAME_MAX,
  TAGLINE_MAX,
  DESCRIPTION_MAX,
  ANNOUNCEMENT_MAX,
} from "@/lib/shared/profile/constants";

function creatorArt(name) {
  return encodeURI(`/tmp-mockup-images/alpha-test-creator-images/${name}.png`);
}

// accountToForm field names carried from the live payload mapping
// (plan 4.3): username, display_name, contact_email, tagline,
// description, announcement, content_rating_preference,
// default_player_character_id, coin balance, metrics. Metrics carry
// four tiles, not five: A1 (ratified 10 Aug 2026) drops Canon from
// the account profile entirely; it may return later.
const FIXTURE_STATES = {
  default: {
    loginEmail: "creator@example.com",
    contactEmail: "creator@example.com",
    username: "vermillion",
    displayName: "Vermillion",
    contentRatingPreference: "EVERYONE",
    defaultPlayerCharacterId: "pc-1",
    tagline: "Building worlds, one lantern at a time.",
    description:
      "A creator focused on gothic adventure settings and character-driven stories, with a soft spot for harbor towns and things that should have stayed buried.",
    announcement: "Currently drafting a new adventure arc set along the coast.",
    coinBalance: 1240,
    metrics: { characters: 12, interactions: 340, likes: 89, images: 24 },
  },
  empty: {
    loginEmail: "newcreator@example.com",
    contactEmail: "",
    username: "",
    displayName: "",
    contentRatingPreference: "EVERYONE",
    defaultPlayerCharacterId: null,
    tagline: "",
    description: "",
    announcement: "",
    coinBalance: 0,
    metrics: { characters: 0, interactions: 0, likes: 0, images: 0 },
  },
  longestContent: {
    loginEmail: "creator.with.a.deliberately.long.login.address@example.com",
    contactEmail: "creator.with.a.deliberately.long.contact.address@example.com",
    username: "the_longest_possible_username_allowed_here",
    displayName: "The Longest Display Name This Field Will Ever Have To Render Without Breaking",
    contentRatingPreference: "ADULT",
    defaultPlayerCharacterId: "pc-1",
    tagline:
      "A deliberately long tagline written to stress the field's character counter and wrapping right up against its own cap of one hundred twenty.",
    description:
      "A deliberately long description written to stress the field's character counter and wrapping behavior across many lines, covering a creator's full history on the platform, the settings they favor, the recurring characters they return to, and the kinds of stories they hope to tell next, right up against the one-thousand-character cap this field carries so the layout is exercised honestly rather than guessed at from a short fixture.",
    announcement:
      "A deliberately long announcement line written to stress this field's counter and wrapping behavior right up against its own cap of three hundred characters, covering an upcoming release window and where to find updates in the meantime.",
    coinBalance: 128400,
    metrics: { characters: 412, interactions: 88210, likes: 15300, images: 960 },
  },
};

// Local fixture-only Player Character pool; not imported from the
// live picker (READ ONLY reference).
const FIXTURE_PLAYER_CHARACTERS = [
  { id: "pc-1", title: "Mara Veyne", description: "A watchful investigator who follows supernatural disturbances through Crestfall.", imageSrc: creatorArt("vermillion-2") },
  { id: "pc-2", title: "Silas Thorn", description: "A former city guard with a talent for surviving places sensible people avoid.", imageSrc: creatorArt("vermillion-4") },
  { id: "pc-3", title: "Ilyra Ash", description: "An occult archivist searching for the missing pages of her family's forbidden history.", imageSrc: creatorArt("vermillion-6") },
];

const SETTINGS_ROWS = [
  { title: "Subscription", body: "Plan, billing, renewal, and future premium access controls.", href: "/studio/account/subscription" },
  { title: "Preferences", body: "Language, creator workflow defaults, discovery preferences, and page-level display settings.", href: "/studio/account/preferences" },
  { title: "Appearance", body: "Theme, density, list/grid defaults, and future Studio display controls.", href: "/studio/account/appearance" },
  { title: "Notifications", body: "Email preferences, product updates, room activity, creator alerts, and review notifications.", href: "/studio/account/notifications" },
  { title: "Privacy", body: "Profile visibility, public activity, blocked users, and account discoverability controls.", href: "/studio/account/privacy" },
  { title: "Safety & Content Settings", body: "Future SFW / mature filters, comfort settings, content boundaries, and moderation controls.", href: "/studio/account/safety" },
];

const FIXTURE_MODES = { default: "Default", empty: "Empty", longestContent: "Longest content" };

function FieldLabel({ label, count }) {
  return (
    <div className="flex items-center justify-between gap-[var(--space-3)]">
      <span className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
        {label}
      </span>
      {typeof count === "string" && (
        <span className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
          {count}
        </span>
      )}
    </div>
  );
}

const FIELD_RECIPE =
  "cf-field mt-[var(--space-2)] min-h-[var(--control-md)] w-full rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)]";

function fieldName(label) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function LabeledInput({ label, value, onChange, maxLength, note, disabled = false }) {
  const name = fieldName(label);
  return (
    <label className="block">
      <FieldLabel label={label} count={maxLength ? `${value.length} / ${maxLength}` : undefined} />
      <input
        type="text"
        name={name}
        id={name}
        value={value}
        maxLength={maxLength}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.value)}
        className={`${FIELD_RECIPE} disabled:opacity-[var(--state-disabled-opacity)]`}
      />
      {note && <p className="mt-[var(--space-2)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">{note}</p>}
    </label>
  );
}

function LabeledTextarea({ label, value, onChange, maxLength, rows = 5 }) {
  const name = fieldName(label);
  return (
    <label className="block">
      <FieldLabel label={label} count={maxLength ? `${value.length} / ${maxLength}` : undefined} />
      <textarea
        name={name}
        id={name}
        value={value}
        maxLength={maxLength}
        rows={rows}
        onChange={(event) => onChange?.(event.target.value)}
        className={`${FIELD_RECIPE} resize-none`}
      />
    </label>
  );
}

function ReadOnlyValue({ label, value, note }) {
  return (
    <div>
      <FieldLabel label={label} />
      <div className="mt-[var(--space-2)] min-h-[var(--control-md)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
        {value}
      </div>
      {note && <p className="mt-[var(--space-2)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">{note}</p>}
    </div>
  );
}

function SectionCard({ label, children, className = "" }) {
  return (
    <section className={`rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-1)] p-[var(--space-5)] ${className}`}>
      {label && (
        <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
          {label}
        </p>
      )}
      <div className={label ? "mt-[var(--space-4)]" : ""}>{children}</div>
    </section>
  );
}

function StatTile({ value, label }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-[var(--space-3)] text-center">
      <p className="font-display text-[length:var(--text-heading)] leading-[var(--lh-heading)] text-[var(--ink)]">
        {new Intl.NumberFormat().format(value)}
      </p>
      <p className="mt-[var(--space-1)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-dim)]">
        {label}
      </p>
    </div>
  );
}

// Honest disabled stub (HIDE/STUB law): the live avatar/banner slots
// have no upload path yet; a quiet "Choose Soon" tag is truthful
// where a dead button would not be. Presentation cue adopted from the
// A2 witness (account.html), which makes the same call explicitly.
function ChooseSoonStub({ label }) {
  return (
    <div className="flex items-center justify-between gap-[var(--space-3)] rounded-[var(--radius-md)] border border-dashed border-[var(--line-strong)] bg-[var(--surface-2)] px-[var(--space-4)] py-[var(--space-3)]">
      <span className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">{label}</span>
      <span className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
        Choose Soon
      </span>
    </div>
  );
}

function AgeGateModal({ requestedLabel, onClose }) {
  return (
    <KitModalFrame variant="modal" panelClassName="w-full max-w-md" onClose={onClose} ariaLabel="Age verification required">
      <div className="p-[var(--space-6)]">
        <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
          Age Verification Required
        </p>
        <h2 className="mt-[var(--space-2)] font-display text-[length:var(--text-title)] leading-[var(--lh-title)] text-[var(--ink)]">
          {requestedLabel} access coming soon
        </h2>
        <p className="mt-[var(--space-4)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
          Mature and explicit content preferences are not active yet. Before anything above Everyone is supported, Crestfall will require age verification and additional account controls.
        </p>
        <p className="mt-[var(--space-3)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
          For now, your account remains set to Everyone.
        </p>
        <button type="button" onClick={onClose} className="kit-focus cf-btn cf-btn--primary mt-[var(--space-5)] w-full">
          OK
        </button>
      </div>
    </KitModalFrame>
  );
}

function BuyCoinsModal({ onClose }) {
  return (
    <KitModalFrame variant="modal" panelClassName="w-full max-w-sm" onClose={onClose} ariaLabel="Buy coins">
      <div className="p-[var(--space-6)]">
        <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
          Crestfall
        </p>
        <h2 className="mt-[var(--space-2)] font-display text-[length:var(--text-title)] leading-[var(--lh-title)] text-[var(--ink)]">
          Buy Coins
        </h2>
        <p className="mt-[var(--space-4)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
          Coin purchases are coming later. For private testing, an admin can manually add coins to your account.
        </p>
        <button type="button" onClick={onClose} className="kit-focus cf-btn cf-btn--primary mt-[var(--space-5)] w-full">
          Got it
        </button>
      </div>
    </KitModalFrame>
  );
}

function DefaultPcPickerModal({ selectedId, onClose, onSelect, onClear }) {
  const [query, setQuery] = useState("");
  const filtered = FIXTURE_PLAYER_CHARACTERS.filter((pc) =>
    pc.title.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <KitModalFrame variant="modal" panelClassName="w-full max-w-5xl" onClose={onClose} ariaLabel="Choose default Player Character">
      <div className="p-[var(--space-6)]">
        <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
          Account Default
        </p>
        <h2 className="mt-[var(--space-2)] font-display text-[length:var(--text-title)] leading-[var(--lh-title)] text-[var(--ink)]">
          Choose Default Player Character
        </h2>
        <p className="mt-[var(--space-2)] max-w-[var(--measure)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
          Your preferred player identity for new story rooms. Other users may view public Player Characters, but only you can use your own PCs as playable identities.
        </p>

        <div className="mt-[var(--space-5)] flex min-h-[var(--control-md)] items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-3)]">
          <Search size={16} className="flex-none text-[var(--ink-faint)]" aria-hidden="true" />
          <input
            type="search"
            name="default-pc-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search your player characters"
            aria-label="Search your player characters"
            className="kit-search-input w-full min-w-0 bg-transparent text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:outline-none"
          />
        </div>

        {filtered.length === 0 ? (
          <p className="mt-[var(--space-5)] rounded-[var(--radius-md)] border border-dashed border-[var(--line-strong)] bg-[var(--surface-2)] p-[var(--space-4)] text-[length:var(--text-ui)] text-[var(--ink-dim)]">
            No Player Character creations found.
          </p>
        ) : (
          <div className="mt-[var(--space-5)] grid gap-[var(--space-4)] min-[700px]:grid-cols-2 min-[1100px]:grid-cols-3">
            {filtered.map((pc) => {
              const isSelected = pc.id === selectedId;
              return (
                <button
                  key={pc.id}
                  type="button"
                  onClick={() => onSelect(pc.id)}
                  className={`kit-focus overflow-hidden rounded-[var(--radius-md)] border bg-[var(--surface-2)] text-left transition-colors ${
                    isSelected ? "border-[var(--gold-ornament)]" : "border-[var(--line)] hover:border-[var(--line-strong)]"
                  }`}
                >
                  <div className="aspect-[4/3] w-full bg-cover bg-center" style={{ backgroundImage: `url(${pc.imageSrc})` }} />
                  <div className="p-[var(--space-4)]">
                    <p className="font-display text-[length:var(--text-lead)] leading-[var(--lh-lead)] text-[var(--ink)]">{pc.title}</p>
                    <p className="mt-[var(--space-1)] line-clamp-2 text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">{pc.description}</p>
                    <div className="mt-[var(--space-2)] flex flex-wrap gap-[var(--space-2)]">
                      <span className="inline-flex h-[var(--space-6)] items-center gap-[var(--space-1)] rounded-[var(--radius-full)] bg-[var(--tag-bed-canvas)] px-[var(--space-3)] text-[length:var(--text-label)] uppercase leading-[var(--lh-label)] tracking-[var(--track-label)] text-[var(--gold-bright)]">
                        <UserRound size={11} aria-hidden="true" />
                        Player Character
                      </span>
                      {isSelected && (
                        <span className="inline-flex h-[var(--space-6)] items-center rounded-[var(--radius-full)] bg-[var(--tag-bed-canvas)] px-[var(--space-3)] text-[length:var(--text-label)] uppercase leading-[var(--lh-label)] tracking-[var(--track-label)] text-[var(--ink-dim)]">
                        Current Default
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {selectedId && (
          <button type="button" onClick={onClear} className="kit-focus cf-btn cf-btn--danger mt-[var(--space-5)]">
            Clear default
          </button>
        )}
      </div>
    </KitModalFrame>
  );
}

export default function AccountV2Mockup() {
  const [fixtureMode, setFixtureMode] = useState("default");
  const base = FIXTURE_STATES[fixtureMode];

  const [contentRatingPreference, setContentRatingPreference] = useState(base.contentRatingPreference);
  const [defaultPlayerCharacterId, setDefaultPlayerCharacterId] = useState(base.defaultPlayerCharacterId);
  const [contactEmail, setContactEmail] = useState(base.contactEmail);
  const [username, setUsername] = useState(base.username);
  const [displayName, setDisplayName] = useState(base.displayName);
  const [tagline, setTagline] = useState(base.tagline);
  const [description, setDescription] = useState(base.description);
  const [announcement, setAnnouncement] = useState(base.announcement);
  const [ageGateLabel, setAgeGateLabel] = useState(null);
  const [isBuyCoinsOpen, setIsBuyCoinsOpen] = useState(false);
  const [isPcPickerOpen, setIsPcPickerOpen] = useState(false);

  function selectFixtureMode(mode) {
    const next = FIXTURE_STATES[mode];
    setFixtureMode(mode);
    setContentRatingPreference(next.contentRatingPreference);
    setDefaultPlayerCharacterId(next.defaultPlayerCharacterId);
    setContactEmail(next.contactEmail);
    setUsername(next.username);
    setDisplayName(next.displayName);
    setTagline(next.tagline);
    setDescription(next.description);
    setAnnouncement(next.announcement);
  }

  function handleContentRatingChange(value) {
    const tier = CONTENT_RATING_TIERS.find((entry) => entry.tier === value);
    if (!tier) return;
    if (tier.tier === "EVERYONE") {
      setContentRatingPreference("EVERYONE");
      return;
    }
    // Live intercept behavior: the account stays on Everyone until age
    // verification exists; the notice opens, the value never actually
    // advances past Everyone.
    setAgeGateLabel(tier.label);
  }

  const defaultPlayerCharacter = FIXTURE_PLAYER_CHARACTERS.find((pc) => pc.id === defaultPlayerCharacterId) || null;
  const hasPublicProfile = Boolean(username);
  const selectedRatingLabel =
    CONTENT_RATING_TIERS.find((tier) => tier.tier === contentRatingPreference)?.label || "Everyone";

  return (
    <>
      <KitStudioPageView
        harnessSlot={
          <div className="flex flex-wrap items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-2)]">
            <span className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
              Fixture mode
            </span>
            {Object.entries(FIXTURE_MODES).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => selectFixtureMode(key)}
                className={`min-h-[var(--control-sm)] rounded-[var(--radius-md)] border px-[var(--space-3)] text-[length:var(--text-label)] transition-colors ${
                  fixtureMode === key
                    ? "border-[var(--line-whisper)] bg-[var(--fill)] text-[var(--gold-bright)]"
                    : "border-[var(--line-whisper)] text-[var(--ink-dim)] hover:border-[var(--line)]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        }
        headerSlot={
          <StudioPageHeaderView
            eyebrow="Account"
            title="Profile & Preferences"
            description="Manage your private account settings, Studio preferences, subscription status, and public creator profile."
          />
        }
      >
        <div className="flex flex-col gap-[var(--space-6)]">
          {/* Identity section: ONE Save control at the section top
              (defect fix: the live page's duplicate bottom Save
              button is dropped in the draft, plan 4.3 item 2 / OPEN
              FOR BRIAN item 19). */}
          <SectionCard>
            <div className="flex flex-wrap items-start justify-between gap-[var(--space-5)]">
              <div className="flex items-center gap-[var(--space-4)]">
                <div className="flex h-[var(--space-16)] w-[var(--space-16)] items-center justify-center rounded-[var(--radius-full)] border border-[var(--gold-ornament)] bg-[var(--fill)] font-display text-[length:var(--text-title)] text-[var(--gold-ornament)]">
                  {(displayName || username || "?").slice(0, 1).toUpperCase()}
                </div>
                <div>
                  <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
                    Crestfall Creator
                  </p>
                  <h2 className="mt-[var(--space-1)] font-display text-[length:var(--text-title)] leading-[var(--lh-title)] text-[var(--ink)]">
                    @{username || "unset"}
                  </h2>
                  <p className="mt-[var(--space-1)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
                    {base.loginEmail}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-[var(--space-3)]">
                {hasPublicProfile && (
                  <Link href={`/studio/profile/${username}`} className="kit-focus cf-btn cf-btn--secondary">
                    View public profile
                  </Link>
                )}
                <button type="button" className="kit-focus cf-btn cf-btn--primary">
                  Save profile
                </button>
              </div>
            </div>
          </SectionCard>

          {/* Profile media section: honest disabled stubs, no upload
              path yet (HIDE/STUB law). */}
          <SectionCard label="Profile Media">
            <div className="grid gap-[var(--space-3)] min-[700px]:grid-cols-2">
              <ChooseSoonStub label="Avatar" />
              <ChooseSoonStub label="Banner" />
            </div>
          </SectionCard>

          {/* Stats section: ONE stats block (defect fix), four tiles
              per A1 (Canon dropped). */}
          <SectionCard label="Stats">
            <div className="grid grid-cols-2 gap-[var(--space-3)] min-[700px]:grid-cols-4">
              <StatTile value={base.metrics.characters} label="Characters" />
              <StatTile value={base.metrics.interactions} label="Interactions" />
              <StatTile value={base.metrics.likes} label="Likes" />
              <StatTile value={base.metrics.images} label="Images" />
            </div>
          </SectionCard>

          {/* Coins section: balance and actions only, no second
              all-zero stat grid (defect fix). */}
          <SectionCard>
            <div className="flex flex-wrap items-center justify-between gap-[var(--space-4)]">
              <div>
                <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
                  Coins
                </p>
                <h2 className="mt-[var(--space-1)] font-display text-[length:var(--text-title)] leading-[var(--lh-title)] text-[var(--ink)]">
                  {new Intl.NumberFormat().format(base.coinBalance)} Crestfall Coins
                </h2>
                <p className="mt-[var(--space-2)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
                  Wallet, purchases, image generation, and premium actions will connect later.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsBuyCoinsOpen(true)}
                className="kit-focus cf-btn cf-btn--secondary inline-flex items-center gap-[var(--space-1)]"
              >
                <ShoppingBag size={14} aria-hidden="true" />
                Buy coins soon
              </button>
            </div>
          </SectionCard>

          {/* Account form section. */}
          <SectionCard label="Account Contact">
            <div className="grid gap-[var(--space-4)] min-[700px]:grid-cols-2">
              <ReadOnlyValue
                label="Login Email"
                value={base.loginEmail}
                note="Read-only here. This does not change your Google login."
              />
              <LabeledInput
                label="Contact Email"
                value={contactEmail}
                onChange={setContactEmail}
                note="Only changes where Crestfall can contact you."
              />
            </div>
          </SectionCard>

          <SectionCard>
            <div className="grid gap-[var(--space-4)] min-[700px]:grid-cols-2">
              <LabeledInput label="Username" value={username} onChange={setUsername} maxLength={USERNAME_MAX} />
              <LabeledInput label="Display Name" value={displayName} onChange={setDisplayName} maxLength={DISPLAY_NAME_MAX} />

              <div className="min-[700px]:col-span-2">
                <FieldLabel label="Content Preference" />
                <div className="mt-[var(--space-2)]">
                  <KitDropdown
                    label={selectedRatingLabel}
                    options={CONTENT_RATING_TIERS.map((tier) => ({ value: tier.tier, label: tier.label, tooltip: tier.tooltip }))}
                    selectedValues={[contentRatingPreference]}
                    isMultiSelect={false}
                    onToggleOption={handleContentRatingChange}
                  />
                </div>
                <p className="mt-[var(--space-2)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
                  Native/mobile experiences remain Everyone-only. Teen and Adult access will require age verification before they become active.
                </p>
              </div>
            </div>
          </SectionCard>

          {/* Default Player Character section. */}
          <SectionCard label="Default Player Character">
            <p className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
              Your preferred player identity for new story rooms. Other users may view public Player Characters, but only you can use your own PCs as playable identities.
            </p>

            {defaultPlayerCharacter ? (
              <div className="mt-[var(--space-4)] flex items-start gap-[var(--space-4)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-[var(--space-4)]">
                <div
                  className="h-[var(--space-16)] w-[var(--space-16)] shrink-0 rounded-[var(--radius-md)] border border-[var(--line)] bg-cover bg-center"
                  style={{ backgroundImage: `url(${defaultPlayerCharacter.imageSrc})` }}
                />
                <div className="min-w-0">
                  <p className="font-display text-[length:var(--text-lead)] leading-[var(--lh-lead)] text-[var(--ink)]">
                    {defaultPlayerCharacter.title}
                  </p>
                  <p className="mt-[var(--space-1)] line-clamp-2 text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
                    {defaultPlayerCharacter.description}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-[var(--space-4)] rounded-[var(--radius-md)] border border-dashed border-[var(--line-strong)] bg-[var(--surface-2)] p-[var(--space-4)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
                No default Player Character selected.
              </p>
            )}

            <div className="mt-[var(--space-4)] flex flex-wrap gap-[var(--space-3)]">
              <button type="button" onClick={() => setIsPcPickerOpen(true)} className="kit-focus cf-btn cf-btn--secondary">
                Choose
              </button>
              {defaultPlayerCharacter && (
                <button
                  type="button"
                  onClick={() => setDefaultPlayerCharacterId(null)}
                  className="kit-focus cf-btn cf-btn--danger"
                >
                  Clear
                </button>
              )}
            </div>
          </SectionCard>

          {/* Public profile text section. */}
          <SectionCard label="Public Profile Text">
            <div className="grid gap-[var(--space-4)] min-[1100px]:grid-cols-3">
              <LabeledTextarea label="Tagline" value={tagline} onChange={setTagline} maxLength={TAGLINE_MAX} />
              <LabeledTextarea label="Description" value={description} onChange={setDescription} maxLength={DESCRIPTION_MAX} />
              <LabeledTextarea label="Announcement" value={announcement} onChange={setAnnouncement} maxLength={ANNOUNCEMENT_MAX} />
            </div>
          </SectionCard>

          {/* Settings rows: route to the LIVE /studio/account/*
              subpages under the strangler pattern; no v2 subpages
              built this sprint. */}
          <SectionCard label="Settings">
            <div className="grid gap-[var(--space-3)] min-[700px]:grid-cols-2">
              {SETTINGS_ROWS.map((row) => (
                <Link
                  key={row.title}
                  href={row.href}
                  className="kit-focus group rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-[var(--space-4)] transition-colors hover:border-[var(--line-strong)]"
                >
                  <div className="flex items-start justify-between gap-[var(--space-3)]">
                    <div>
                      <p className="font-display text-[length:var(--text-lead)] leading-[var(--lh-lead)] text-[var(--ink)]">
                        {row.title}
                      </p>
                      <p className="mt-[var(--space-2)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
                        {row.body}
                      </p>
                    </div>
                    <span className="mt-[var(--space-1)] flex-none text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)] opacity-70 transition-opacity group-hover:opacity-100">
                      Open
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </SectionCard>

          {/* Sign out row: styled, fixture no-op. */}
          <div className="pt-[var(--space-2)] text-center">
            <button type="button" className="kit-focus cf-btn cf-btn--secondary">
              Sign Out
            </button>
          </div>
        </div>
      </KitStudioPageView>

      {ageGateLabel && <AgeGateModal requestedLabel={ageGateLabel} onClose={() => setAgeGateLabel(null)} />}
      {isBuyCoinsOpen && <BuyCoinsModal onClose={() => setIsBuyCoinsOpen(false)} />}
      {isPcPickerOpen && (
        <DefaultPcPickerModal
          selectedId={defaultPlayerCharacterId}
          onClose={() => setIsPcPickerOpen(false)}
          onSelect={(id) => {
            setDefaultPlayerCharacterId(id);
            setIsPcPickerOpen(false);
          }}
          onClear={() => {
            setDefaultPlayerCharacterId(null);
            setIsPcPickerOpen(false);
          }}
        />
      )}
    </>
  );
}
