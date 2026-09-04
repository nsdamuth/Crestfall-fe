"use client";

import { MapPin, Palette, UserRound } from "lucide-react";

import KitModalFrame from "@/components/kit/KitModalFrame";

function ChoiceButton({ active = false, title, subtitle = "", onClick }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-[var(--radius-md)] border px-[var(--space-4)] py-[var(--space-3)] text-left transition-colors ${
        active
          ? "border-[var(--gold-ornament)] bg-[var(--fill)] text-[var(--ink)]"
          : "border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--ink-dim)] hover:border-[var(--line)] hover:text-[var(--ink)]"
      }`}
    >
      <span className="block text-[length:var(--text-ui)] font-medium">{title}</span>
      {subtitle ? (
        <span className="mt-[var(--space-1)] block text-[length:var(--text-label)] leading-[var(--lh-ui)] text-[var(--ink-faint)]">
          {subtitle}
        </span>
      ) : null}
    </button>
  );
}

function SectionHeading({ Icon, title, description }) {
  return (
    <div>
      <p className="flex items-center gap-[var(--space-2)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
        <Icon size={14} aria-hidden="true" />
        {title}
      </p>
      <p className="mt-[var(--space-2)] text-[length:var(--text-ui)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
        {description}
      </p>
    </div>
  );
}

export default function StoryLaunchRequirementsSheet({ picker }) {
  if (!picker?.open) return null;

  const player = picker.playerCharacter || null;
  const playerSelection = String(player?.selection || "").toUpperCase();
  const selectedPlayerId = player?.selectedPlayerCharacterId || "";
  const defaultPlayerId = player?.defaultPlayerCharacterId || "";
  const playerOptions = Array.isArray(player?.options) ? player.options : [];
  const alternatePlayers = playerOptions.filter(
    (option) => option?.id && option.id !== defaultPlayerId
  );
  const imageStyle = picker.imageStyle || null;
  const selectedStyle = String(imageStyle?.selectedStyle || "").toUpperCase();
  const styleOptions = (Array.isArray(imageStyle?.allowedStyles)
    ? imageStyle.allowedStyles
    : []
  ).map((value) => ({
    value: String(value || "").toUpperCase(),
    label:
      String(value || "").toUpperCase() === "EITHER"
        ? "Either / Auto"
        : String(value || "")
            .toLowerCase()
            .replace(/(^|\s)\S/g, (character) => character.toUpperCase()),
  }));

  const locationReady =
    !picker.locationSelectionRequired || Boolean(picker.selectedLocationId);
  const playerReady =
    !player?.selectionRequired ||
    (playerSelection === "DEFAULT" && Boolean(defaultPlayerId)) ||
    (playerSelection === "SELECTED" && Boolean(selectedPlayerId)) ||
    (playerSelection === "NONE" && Boolean(player?.allowNone));
  const styleReady =
    !imageStyle?.selectionRequired ||
    styleOptions.some((option) => option.value === selectedStyle);

  return (
    <KitModalFrame
      variant="modal"
      panelClassName="w-full max-w-3xl"
      onClose={picker.onCancel}
      ariaLabel={`Start ${picker.creationTitle || "Story"}`}
    >
      <div className="p-[var(--space-5)] sm:p-[var(--space-6)]">
        <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
          Start Story
        </p>
        <h2 className="mt-[var(--space-2)] font-display text-[length:var(--text-head)] leading-[var(--lh-head)] text-[var(--ink)]">
          {picker.creationTitle || "Story"}
        </h2>
        <p className="mt-[var(--space-2)] text-[length:var(--text-ui)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
          Resolve the creator-authored launch choices before the Story room is created.
        </p>

        <div className="mt-[var(--space-6)] flex flex-col gap-[var(--space-6)]">
          {picker.locationSelectionRequired ? (
            <section>
              <SectionHeading
                Icon={MapPin}
                title="Starting location"
                description="Choose one of the Locations the Story author explicitly allowed for its opening state."
              />
              <div className="mt-[var(--space-3)] grid gap-[var(--space-2)] sm:grid-cols-2">
                {(picker.locationOptions || []).map((location) => (
                  <ChoiceButton
                    key={location.id}
                    active={location.id === picker.selectedLocationId}
                    title={location.title}
                    subtitle={location.subtitle || ""}
                    onClick={() => picker.onSelectLocation?.(location.id)}
                  />
                ))}
              </div>
            </section>
          ) : null}

          {player?.selectionRequired ? (
            <section className="border-t border-[var(--line-whisper)] pt-[var(--space-5)]">
              <SectionHeading
                Icon={UserRound}
                title="Player character"
                description="Choose the player identity for this Story. Ownership and mechanics requirements are validated again by the server."
              />
              <div className="mt-[var(--space-3)] grid gap-[var(--space-2)]">
                {player.defaultOption ? (
                  <ChoiceButton
                    active={playerSelection === "DEFAULT"}
                    title={`Use default — ${player.defaultOption.title}`}
                    subtitle={
                      player.defaultOption.subtitle ||
                      "Use your current default Player Character."
                    }
                    onClick={() =>
                      picker.onSelectPlayerCharacter?.({
                        selection: "DEFAULT",
                        playerCharacterId: defaultPlayerId,
                      })
                    }
                  />
                ) : null}

                {alternatePlayers.map((option) => (
                  <ChoiceButton
                    key={option.id}
                    active={
                      playerSelection === "SELECTED" && selectedPlayerId === option.id
                    }
                    title={option.title}
                    subtitle={option.subtitle || "Use this Player Character."}
                    onClick={() =>
                      picker.onSelectPlayerCharacter?.({
                        selection: "SELECTED",
                        playerCharacterId: option.id,
                      })
                    }
                  />
                ))}

                {player.allowNone ? (
                  <ChoiceButton
                    active={playerSelection === "NONE"}
                    title="Create temporary Story character"
                    subtitle="Use a room-local player actor. Required mechanics can be configured before play without creating a saved Player Character."
                    onClick={() =>
                      picker.onSelectPlayerCharacter?.({
                        selection: "NONE",
                        playerCharacterId: "",
                      })
                    }
                  />
                ) : null}
              </div>
            </section>
          ) : null}

          {imageStyle?.selectionRequired ? (
            <section className="border-t border-[var(--line-whisper)] pt-[var(--space-5)]">
              <SectionHeading
                Icon={Palette}
                title="Image style"
                description="Choose the Story-session preference for future in-chat imagery. This does not change Story mechanics."
              />
              <div className="mt-[var(--space-3)] grid gap-[var(--space-2)] sm:grid-cols-3">
                {styleOptions.map((option) => (
                  <ChoiceButton
                    key={option.value}
                    active={selectedStyle === option.value}
                    title={option.label}
                    onClick={() => picker.onSelectImageStyle?.(option.value)}
                  />
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <div aria-hidden="true" className="mt-[var(--space-6)] h-px bg-[image:var(--line-fade)]" />
        <div className="mt-[var(--space-4)] flex flex-wrap items-center justify-between gap-[var(--space-2)]">
          <button
            type="button"
            onClick={() => picker.onCancel?.()}
            disabled={picker.pending}
            className="cf-btn cf-btn--secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => picker.onConfirm?.()}
            disabled={picker.pending || !locationReady || !playerReady || !styleReady}
            className="cf-btn cf-btn--primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {picker.pending ? "Starting..." : "Start Story"}
          </button>
        </div>
      </div>
    </KitModalFrame>
  );
}
