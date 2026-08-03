export default function ScenarioRecommendationsPanelView({
  requiredCharacterTitles = [],
  optionalCharacterTitles = [],
  suggestedLocationTitle = "",
  suggestedNarratorTitle = "",
  suggestedNpcRegistryTitles = [],
  canApplyRequiredCharacters = false,
  canApplyOptionalCharacters = false,
  canApplySuggestedLocation = false,
  canApplySuggestedNarrator = false,
  canApplySuggestedNpcRegistries = false,
  onApplyAll = null,
  onApplyRequiredCharacters = null,
  onApplyOptionalCharacters = null,
  onApplySuggestedLocation = null,
  onApplySuggestedNarrator = null,
  onApplySuggestedNpcRegistries = null,
  onSkipRecommendations = null,
}) {
  return (
    <div className="rounded-2xl border border-[var(--muted-gold)]/30 bg-[var(--muted-gold)]/10 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
            Scenario Recommendations
          </p>
          <h3 className="mt-2 font-display text-3xl">
            Apply suggested room ingredients?
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This scenario includes script-level recommendations. You can apply
            them to this room package, review them one by one, or skip them.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onApplyAll?.()}
            className="rounded-xl border border-[var(--muted-gold)]/45 bg-black/30 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/15 hover:text-[var(--foreground)]"
          >
            Apply All
          </button>

          <button
            type="button"
            onClick={() => onSkipRecommendations?.()}
            className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)] transition hover:text-[var(--foreground)]"
          >
            Skip
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-3 xl:grid-cols-2">
        <RecommendationGroup
          title="Required Characters"
          itemTitles={requiredCharacterTitles}
          showAction={canApplyRequiredCharacters}
          onApply={onApplyRequiredCharacters}
        />

        <RecommendationGroup
          title="Optional Characters"
          itemTitles={optionalCharacterTitles}
          showAction={canApplyOptionalCharacters}
          onApply={onApplyOptionalCharacters}
        />

        <RecommendationSingle
          title="Suggested Location"
          itemTitle={suggestedLocationTitle}
          showAction={canApplySuggestedLocation}
          onApply={onApplySuggestedLocation}
        />

        <RecommendationSingle
          title="Suggested Narrator"
          itemTitle={suggestedNarratorTitle}
          showAction={canApplySuggestedNarrator}
          onApply={onApplySuggestedNarrator}
        />

        <RecommendationGroup
          title="Suggested NPC Registries"
          itemTitles={suggestedNpcRegistryTitles}
          showAction={canApplySuggestedNpcRegistries}
          onApply={onApplySuggestedNpcRegistries}
        />
      </div>
    </div>
  );
}

function RecommendationGroup({
  title = "",
  itemTitles = [],
  showAction = false,
  onApply = null,
}) {
  return (
    <div className="min-w-0 rounded-xl border border-white/10 bg-black/25 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
        {title}
      </p>

      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
        {itemTitles.length ? itemTitles.join(", ") : "No recommendations."}
      </p>

      {showAction ? (
        <button
          type="button"
          onClick={() => onApply?.()}
          className="mt-3 w-fit rounded-lg border border-white/10 px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-[var(--muted)] transition hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)]"
        >
          Apply
        </button>
      ) : null}
    </div>
  );
}

function RecommendationSingle({
  title = "",
  itemTitle = "",
  showAction = false,
  onApply = null,
}) {
  return (
    <div className="min-w-0 rounded-xl border border-white/10 bg-black/25 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
        {title}
      </p>

      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
        {itemTitle || "No recommendation."}
      </p>

      {showAction ? (
        <button
          type="button"
          onClick={() => onApply?.()}
          className="mt-3 w-fit rounded-lg border border-white/10 px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-[var(--muted)] transition hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)]"
        >
          Use
        </button>
      ) : null}
    </div>
  );
}
