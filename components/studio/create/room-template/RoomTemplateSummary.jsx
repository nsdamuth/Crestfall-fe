export default function RoomTemplateSummary({
  selectedCharacters,
  selectedScenario,
  selectedNarrator,
  selectedLocation,
}) {
  return (
    <div className="mt-5 rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-5">
      <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
        Story Package
      </p>

      <div className="mt-3 space-y-2 text-sm leading-6 text-[var(--ink-dim)]">
        <p>Characters: {selectedCharacters.length || "None selected"}</p>
        <p>Scenario: {selectedScenario?.title || "Not selected"}</p>
        <p>Narrator: {selectedNarrator?.title || "Not selected"}</p>
        <p>Location: {selectedLocation?.title || "Optional"}</p>
      </div>
    </div>
  );
}
