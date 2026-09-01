"use client";

import {
  Eyebrow,
  Fold,
  InlineDropdown,
  TextAreaField,
} from "../shared/Controls";
import {
  HEART_NOTES_MAX_LENGTH,
  HEART_TEXT_MAX_LENGTH,
  VERBOSITY_OPTIONS,
} from "./HeartStop.contract";

export default function HeartStopView({
  outwardPersonalityControl = null,
  internalPersonalityControl = null,
  mbtiControl = null,
  westernZodiacControl = null,
  eastAsianZodiacControl = null,
  speechStyleControl = null,
  movementStyleControl = null,
  voiceModulesControl = null,
  interestsControl = null,
  greeting = "",
  verbosityLevel = "",
  philosophy = "",
  relationshipToPlayer = "",
  personalityNotes = "",
  onChangeGreeting = null,
  onChangeVerbosityLevel = null,
  onChangePhilosophy = null,
  onChangeRelationshipToPlayer = null,
  showRelationshipToPlayer = true,
  onChangePersonalityNotes = null,
  advancedFoldOpen = false,
  onToggleAdvancedFold = null,
  fieldScope = "full",
} = {}) {
  const isQuick = fieldScope === "quick";
  const advancedFilled = Boolean(
    greeting ||
      (showRelationshipToPlayer && relationshipToPlayer) ||
      personalityNotes
  );

  return (
    <>
      <Eyebrow>Define their behavior</Eyebrow>
      <h2 className="mt-2 font-display text-3xl text-[var(--ink)]">
        Behavior
      </h2>
      <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
        Define how this character speaks, moves, thinks, and expresses
        themselves. These choices help prevent every character from feeling
        the same.
      </p>

      <div className="mt-6 grid gap-[var(--space-4)] md:grid-cols-2">
        {outwardPersonalityControl}
        {internalPersonalityControl}

        {!isQuick ? (
          <div className="md:col-span-2 rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] p-[var(--space-4)]">
            <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
              Optional personality frameworks
            </p>
            <p className="mt-[var(--space-2)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
              These provide soft narrative flavor when the composer needs more
              characterization. They are optional and never override explicit
              personality choices, behavior settings, or creator notes.
            </p>

            <div className="mt-[var(--space-4)] grid gap-[var(--space-4)] md:grid-cols-3">
              {mbtiControl}
              {westernZodiacControl}
              {eastAsianZodiacControl}
            </div>
          </div>
        ) : null}

        {speechStyleControl}
        {movementStyleControl}

        {!isQuick && voiceModulesControl ? (
          <div className="md:col-span-2">{voiceModulesControl}</div>
        ) : null}

        <InlineDropdown
          label="Verbosity"
          options={VERBOSITY_OPTIONS}
          value={verbosityLevel}
          onChange={onChangeVerbosityLevel}
        />

        {interestsControl}

        <div className="md:col-span-2">
          <TextAreaField
            label="Philosophy"
            value={philosophy}
            onChange={onChangePhilosophy}
            placeholder="What does this character believe about the world, people, power, duty, freedom, love, fear, or survival?"
            maxLength={HEART_TEXT_MAX_LENGTH}
          />
        </div>
      </div>

      {!isQuick ? (
        <Fold
          title="Additional guidance"
          sub="Greeting, relationship, and deeper personality notes"
          open={advancedFoldOpen}
          onToggle={onToggleAdvancedFold}
          filled={advancedFilled}
        >
          <TextAreaField
            label="Greeting"
            value={greeting}
            onChange={onChangeGreeting}
            placeholder="Optional opening message"
            maxLength={HEART_TEXT_MAX_LENGTH}
          />

          {showRelationshipToPlayer ? (
            <TextAreaField
              label="Relationship to the player"
              value={relationshipToPlayer}
              onChange={onChangeRelationshipToPlayer}
              placeholder="Optional starting relationship or dynamic"
              maxLength={HEART_NOTES_MAX_LENGTH}
            />
          ) : null}

          <TextAreaField
            label="Personality notes"
            value={personalityNotes}
            onChange={onChangePersonalityNotes}
            placeholder="Anything else about how they think or feel"
            maxLength={HEART_NOTES_MAX_LENGTH}
          />
        </Fold>
      ) : null}
    </>
  );
}
