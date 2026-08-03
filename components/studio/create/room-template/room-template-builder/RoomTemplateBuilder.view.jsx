"use client";

import {
  BookOpen,
  Image as ImageIcon,
  Plus,
  Save,
  ShieldCheck,
  Sparkles,
  Theater,
} from "lucide-react";

import CrestfallSelect from "@/components/ui/CrestfallSelect";
import BuilderSection from "@/components/studio/room-templates/BuilderSection";
import {
  TextAreaField,
  TextField,
} from "@/components/studio/room-templates/RoomTemplateFields";
import RoomTemplateSummaryView from "@/components/studio/room-templates/room-template-summary/RoomTemplateSummary.view";
import SelectedCharactersPanelView from "@/components/studio/room-templates/selected-characters-panel/SelectedCharactersPanel.view";
import SelectionCardView from "@/components/studio/room-templates/selection-card/SelectionCard.view";
import ScenarioRecommendationsPanelView from "@/components/studio/room-templates/scenario-recommendations-panel/ScenarioRecommendationsPanel.view";
import InvitedPlayersPanelView from "@/components/studio/room-templates/invited-players-panel/InvitedPlayersPanel.view";
import OpeningMessageCardView from "@/components/studio/room-templates/opening-message-card/OpeningMessageCard.view";

export default function RoomTemplateBuilderView({
  form = {},
  completion = 0,
  saveStatus = "idle",
  saveMessage = "",
  saveDisabled = false,
  referenceLoadError = "",
  effectiveTurnBased = false,
  selectedScenario = null,
  selectedNarrator = null,
  selectedLocation = null,
  showScenarioRecommendations = false,
  summaryProps = {},
  selectedCharactersPanelProps = {},
  scenarioRecommendationsPanelProps = {},
  invitedPlayersPanelProps = {},
  openingMessageCards = [],
  displayMediaSlot = 0,
  visibilityOptions = [],
  contentRatingOptions = [],
  roomModeOptions = [],
  playerCharacterOptions = [],
  runtimeAttachmentsContent = null,
  onUpdateField = null,
  onToggleTurnBased = null,
  onOpenScenarioPicker = null,
  onOpenNarratorPicker = null,
  onOpenLocationPicker = null,
  onAddOpeningMessage = null,
  onSelectDisplayMediaSlot = null,
  onSave = null,
} = {}) {
  const safeOpeningMessageCards = Array.isArray(openingMessageCards)
    ? openingMessageCards
    : [];

  return (
    <section className="mt-8 grid gap-6 xl:grid-cols-[0.42fr_1fr]">
      <aside className="self-start rounded-2xl border border-[var(--muted-gold)]/20 bg-black/45 p-5 xl:sticky xl:top-24">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
          Story Builder
        </p>

        <h2 className="mt-2 font-display text-4xl">
          {form.title || "Untitled Story"}
        </h2>

        <p className="mt-3 leading-7 text-[var(--muted)]">
          A Story packages characters, a scenario, narrator guidance,
          locations, registries, runtime modules, opening messages, and play
          rules into a reusable playable setup.
        </p>

        <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
            Draft Progress
          </p>

          <p className="mt-2 font-display text-4xl">{completion}%</p>

          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Stories start private. Public review and canon submission happen
            later from My Creations.
          </p>
        </div>

        <RoomTemplateSummaryView {...summaryProps} />

        <button
          type="button"
          onClick={() => onSave?.()}
          disabled={saveDisabled}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-4 text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={15} />
          {saveStatus === "saving" ? "Saving..." : "Save Draft"}
        </button>

        {saveMessage ? (
          <p
            className={`mt-3 text-sm ${
              saveStatus === "error" ? "text-red-200" : "text-emerald-200"
            }`}
          >
            {saveMessage}
          </p>
        ) : null}
      </aside>

      <div className="space-y-6">
        <BuilderSection
          eyebrow="Overview"
          title="Story Identity"
          body="Define how this Story appears to you and, later, to other users if shared."
        >
          <div className="grid gap-5">
            <TextField
              label="Title"
              value={form.title || ""}
              onChange={(value) => onUpdateField?.("title", value)}
              placeholder="e.g., The Cat Warmech Built"
            />

            <TextAreaField
              label="Public Description"
              value={form.public_description || ""}
              onChange={(value) =>
                onUpdateField?.("public_description", value)
              }
              placeholder="Player-facing description for this Story."
              rows={5}
            />

            <div className="grid gap-4 md:grid-cols-3">
              <CrestfallSelect
                label="Story Mode"
                value={form.room_mode || ""}
                onChange={(value) => onUpdateField?.("room_mode", value)}
                options={roomModeOptions}
              />

              <CrestfallSelect
                label="Player Character"
                value={form.player_character_mode || ""}
                onChange={(value) =>
                  onUpdateField?.("player_character_mode", value)
                }
                options={playerCharacterOptions}
              />

              <CrestfallSelect
                label="Content Rating"
                value={form.content_rating || ""}
                onChange={(value) =>
                  onUpdateField?.("content_rating", value)
                }
                options={contentRatingOptions}
              />
            </div>
          </div>
        </BuilderSection>

        <BuilderSection
          eyebrow="Story Package"
          title="Characters, Scenario, Narrator"
          body="Choose the assets and runtime context that make this Story playable. Scenario recommendations can be applied, skipped, or replaced."
        >
          <div className="grid gap-4">
            <SelectedCharactersPanelView
              {...selectedCharactersPanelProps}
            />

            {referenceLoadError ? (
              <p className="text-sm text-red-200">{referenceLoadError}</p>
            ) : null}

            {showScenarioRecommendations ? (
              <ScenarioRecommendationsPanelView
                {...scenarioRecommendationsPanelProps}
              />
            ) : null}

            <div className="grid gap-4 md:grid-cols-3">
              <SelectionCardView
                label="Scenario"
                icon={BookOpen}
                value={selectedScenario}
                placeholder="Select Scenario"
                onOpen={onOpenScenarioPicker}
              />

              <SelectionCardView
                label="Narrator"
                icon={Theater}
                value={selectedNarrator}
                placeholder="Select Narrator"
                onOpen={onOpenNarratorPicker}
              />

              <SelectionCardView
                label="Location / Scene"
                icon={Sparkles}
                value={selectedLocation}
                placeholder="Optional Location"
                onOpen={onOpenLocationPicker}
              />
            </div>
          </div>
        </BuilderSection>

        <BuilderSection
          eyebrow="Multiplayer"
          title="Players and Turn Order"
          body="Invite mutual followers for future multiplayer Stories. Multiplayer Stories are always turn-based."
        >
          <div className="grid gap-5">
            <button
              type="button"
              onClick={() => onToggleTurnBased?.()}
              className={`rounded-2xl border p-5 text-left transition ${
                effectiveTurnBased
                  ? "border-[var(--muted-gold)]/60 bg-[var(--muted-gold)]/15 text-[var(--foreground)]"
                  : "border-white/10 bg-black/25 text-[var(--muted)] hover:border-[var(--muted-gold)]/30 hover:text-[var(--foreground)]"
              }`}
            >
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
                Turn-Based Story
              </p>

              <p className="mt-2 text-sm leading-6">
                {effectiveTurnBased
                  ? "Turn-based mode is enabled. Player turns and NPC response cycles can be handled by the room runtime later."
                  : "Freeform mode. Players can choose who responds until turn-based mode is enabled."}
              </p>

              {invitedPlayersPanelProps.invitedPlayers?.length ? (
                <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
                  Multiplayer invitees are selected, so turn-based mode is
                  required.
                </p>
              ) : null}
            </button>

            <InvitedPlayersPanelView {...invitedPlayersPanelProps} />
          </div>
        </BuilderSection>

        <BuilderSection
          eyebrow="Opening"
          title="Opening Context and Messages"
          body="Opening messages define how the room begins. These can come from the narrator, a selected character, or a player-facing prompt."
        >
          <div className="grid gap-5">
            <TextAreaField
              label="Public Opening Context"
              value={form.public_opening_context || ""}
              onChange={(value) =>
                onUpdateField?.("public_opening_context", value)
              }
              placeholder="Visible setup shown at the start of the room."
              rows={5}
            />

            <div className="grid gap-4">
              {safeOpeningMessageCards.map((message) => (
                <OpeningMessageCardView key={message.id} {...message} />
              ))}

              <button
                type="button"
                onClick={() => onAddOpeningMessage?.()}
                className="inline-flex w-fit items-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)]"
              >
                <Plus size={14} />
                Add Opening Message
              </button>
            </div>
          </div>
        </BuilderSection>

        <BuilderSection
          eyebrow="Display Media"
          title="Featured Room Media"
          body="Later this will select images from the internal media library. No external uploads."
        >
          <div className="grid gap-5 lg:grid-cols-[0.45fr_1fr]">
            <div className="aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-black via-black/80 to-[var(--muted-gold)]/10">
              <div className="flex h-full w-full items-center justify-center">
                <div className="text-center">
                  <ImageIcon
                    className="mx-auto text-[var(--muted-gold)]"
                    size={34}
                  />
                  <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
                    Display Media Slot
                  </p>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    Slot {displayMediaSlot + 1}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="grid grid-cols-4 gap-2">
                {[0, 1, 2, 3].map((slot) => {
                  const active = displayMediaSlot === slot;

                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => onSelectDisplayMediaSlot?.(slot)}
                      className={`aspect-square rounded-xl border text-[10px] uppercase tracking-[0.12em] transition ${
                        active
                          ? "border-[var(--muted-gold)]/60 bg-[var(--muted-gold)]/15 text-[var(--foreground)]"
                          : "border-white/10 bg-black/30 text-[var(--muted)] hover:border-[var(--muted-gold)]/35"
                      }`}
                    >
                      Slot {slot + 1}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                disabled
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)] opacity-60"
              >
                <ImageIcon size={14} />
                Choose From Media Library Soon
              </button>
            </div>
          </div>
        </BuilderSection>

        <BuilderSection
          eyebrow="Private Runtime"
          title="Story Runtime Context"
          body="Attach Story-specific Rules Codices, registry context, and optional hidden runtime guidance. Story registries take priority over inherited Location registries."
        >
          <div className="grid gap-6">
            {runtimeAttachmentsContent}

            <TextAreaField
              label="Private Story Guidance"
              value={form.private_room_guidance || ""}
              onChange={(value) =>
                onUpdateField?.("private_room_guidance", value)
              }
              placeholder="Optional hidden runtime notes for this Story."
              rows={8}
            />
          </div>
        </BuilderSection>

        <BuilderSection
          eyebrow="Publishing"
          title="Draft Settings"
          body="Stories start private or unlisted. Public review should be deliberate and handled later from My Creations."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <CrestfallSelect
              label="Visibility"
              value={form.visibility || ""}
              onChange={(value) => onUpdateField?.("visibility", value)}
              options={visibilityOptions}
            />

            <TextField
              label="Tags"
              value={form.tags || ""}
              onChange={(value) => onUpdateField?.("tags", value)}
              placeholder="e.g., group, quest, aethelgard, canon"
            />
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck
                className="mt-1 text-[var(--muted-gold)]"
                size={19}
              />
              <div>
                <p className="text-sm text-[var(--foreground)]">
                  Future public requirements
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  Later, public Stories will require approved characters,
                  reviewed scenario content, visible display media, and a
                  minimum public description before submission.
                </p>
              </div>
            </div>
          </div>
        </BuilderSection>
      </div>
    </section>
  );
}
