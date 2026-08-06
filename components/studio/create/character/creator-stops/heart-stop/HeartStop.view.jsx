"use client";

import {
  EmptyStateCard,
  Fold,
  InlineDropdown,
  TextAreaField,
} from "../shared/Controls";
import {
  HEART_NOTES_MAX_LENGTH,
  HEART_TEXT_MAX_LENGTH,
  INTEREST_OPTIONS,
  SPEECH_STYLE_OPTIONS,
  VERBOSITY_OPTIONS,
} from "./HeartStop.contract";

export default function HeartStopView({
  outwardPersonality = "",
  internalPersonality = "",
  speechStyle = "",
  greeting = "",
  scenario = "",
  backstory = "",
  verbosityLevel = "",
  philosophy = "",
  interests = "",
  relationshipToPlayer = "",
  voiceModuleIds = [],
  personalityNotes = "",
  onChangeOutwardPersonality = null,
  onChangeInternalPersonality = null,
  onChangeSpeechStyle = null,
  onChangeGreeting = null,
  onChangeScenario = null,
  onChangeBackstory = null,
  onChangeVerbosityLevel = null,
  onChangePhilosophy = null,
  onChangeInterests = null,
  onChangeRelationshipToPlayer = null,
  onOpenVoiceModulePicker = null,
  onChangePersonalityNotes = null,
  advancedFoldOpen = false,
  onToggleAdvancedFold = null,
} = {}) {
  const advancedFilled = Boolean(
    verbosityLevel ||
      philosophy ||
      interests ||
      relationshipToPlayer ||
      (voiceModuleIds && voiceModuleIds.length) ||
      personalityNotes
  );

  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/25 p-6">
      <h2 className="font-display text-3xl text-[var(--ink)]">
        How do they meet the world?
      </h2>
      <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
        The face they show first. Their private self can differ.
      </p>

      <div className="mt-6 space-y-[var(--space-4)]">
        <TextAreaField
          label="Outward personality"
          value={outwardPersonality}
          onChange={onChangeOutwardPersonality}
          placeholder="How they present to people they've just met"
          maxLength={HEART_TEXT_MAX_LENGTH}
        />

        <TextAreaField
          label="Internal personality"
          value={internalPersonality}
          onChange={onChangeInternalPersonality}
          placeholder="Who they are when no one is watching"
          maxLength={HEART_TEXT_MAX_LENGTH}
        />

        <InlineDropdown
          label="Speech style"
          options={SPEECH_STYLE_OPTIONS}
          value={speechStyle}
          onChange={onChangeSpeechStyle}
        />

        <TextAreaField
          label="Greeting"
          value={greeting}
          onChange={onChangeGreeting}
          placeholder="The first thing they say"
          maxLength={HEART_TEXT_MAX_LENGTH}
        />

        <TextAreaField
          label="Scenario"
          value={scenario}
          onChange={onChangeScenario}
          placeholder="The situation the story opens in"
          maxLength={HEART_TEXT_MAX_LENGTH}
        />

        <TextAreaField
          label="Backstory"
          value={backstory}
          onChange={onChangeBackstory}
          placeholder="What brought them here"
          maxLength={HEART_TEXT_MAX_LENGTH}
        />
      </div>

      <Fold
        title="Advanced"
        sub="Verbosity, philosophy, interests, and voice"
        open={advancedFoldOpen}
        onToggle={onToggleAdvancedFold}
        filled={advancedFilled}
      >
        <InlineDropdown
          label="Verbosity"
          options={VERBOSITY_OPTIONS}
          value={verbosityLevel}
          onChange={onChangeVerbosityLevel}
        />

        <TextAreaField
          label="Philosophy"
          value={philosophy}
          onChange={onChangePhilosophy}
          placeholder="What they believe about the world"
          maxLength={HEART_TEXT_MAX_LENGTH}
        />

        <InlineDropdown
          label="Interests"
          options={INTEREST_OPTIONS}
          value={interests}
          onChange={onChangeInterests}
        />

        <TextAreaField
          label="Relationship to the player"
          value={relationshipToPlayer}
          onChange={onChangeRelationshipToPlayer}
          placeholder="How they relate to whoever they're talking to"
          maxLength={HEART_NOTES_MAX_LENGTH}
        />

        <EmptyStateCard
          message={
            voiceModuleIds && voiceModuleIds.length
              ? `${voiceModuleIds.length} voice module${voiceModuleIds.length === 1 ? "" : "s"} attached.`
              : "No voice modules attached. The voice module picker is not built in this pass."
          }
          actions={[
            { label: "Select voice modules", onClick: onOpenVoiceModulePicker },
          ]}
        />

        <TextAreaField
          label="Personality notes"
          value={personalityNotes}
          onChange={onChangePersonalityNotes}
          placeholder="Anything else about how they think or feel"
          maxLength={HEART_NOTES_MAX_LENGTH}
        />
      </Fold>
    </div>
  );
}
