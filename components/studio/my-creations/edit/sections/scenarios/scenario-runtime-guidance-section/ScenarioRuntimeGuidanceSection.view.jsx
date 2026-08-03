import {
  SectionTitle,
  TextAreaField,
} from "@/components/studio/my-creations/edit/sections/SharedFields";

export default function ScenarioRuntimeGuidanceSectionView({
  sectionEyebrow = "Scenario Editor",
  sectionTitle = "Opening Scene and Runtime Guidance",
  sectionDescription = "",
  openingScene = "",
  openingMessages = "",
  privateRuntimeGuidance = "",
  driftFixes = "",
  failureHandling = "",
  onOpeningSceneChange = null,
  onOpeningMessagesChange = null,
  onPrivateRuntimeGuidanceChange = null,
  onDriftFixesChange = null,
  onFailureHandlingChange = null,
}) {
  return (
    <div>
      <SectionTitle
        eyebrow={sectionEyebrow}
        title={sectionTitle}
        body={sectionDescription}
      />

      <div className="mt-6 grid gap-5">
        <TextAreaField
          label="Opening Scene"
          value={openingScene}
          onChange={(value) => onOpeningSceneChange?.(value)}
          placeholder="The opening scene or starting moment."
        />

        <TextAreaField
          label="Opening Messages"
          value={openingMessages}
          onChange={(value) => onOpeningMessagesChange?.(value)}
          placeholder="Optional opening messages by narrator or selected characters."
        />

        <TextAreaField
          label="Private Runtime Guidance"
          value={privateRuntimeGuidance}
          onChange={(value) => onPrivateRuntimeGuidanceChange?.(value)}
          placeholder="Hidden scenario guidance for AI/runtime behavior."
        />

        <div className="grid gap-5 md:grid-cols-2">
          <TextAreaField
            label="Drift Fixes"
            value={driftFixes}
            onChange={(value) => onDriftFixesChange?.(value)}
            placeholder="Optional corrections if the scenario starts drifting."
          />

          <TextAreaField
            label="Failure Handling"
            value={failureHandling}
            onChange={(value) => onFailureHandlingChange?.(value)}
            placeholder="Optional guidance for setbacks, failed attempts, or alternate resolution paths."
          />
        </div>
      </div>
    </div>
  );
}
