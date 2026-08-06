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
    <div className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/30 bg-[var(--gold-ornament)]/10 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
            Scenario Recommendations
          </p>
          <h3 className="mt-2 font-display text-3xl">
            Apply suggested room ingredients?
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--ink-dim)]">
            This scenario includes script-level recommendations. You can apply
            them to this room package, review them one by one, or skip them.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onApplyAll?.()}
            className="cf-btn cf-btn--primary"
          >
            Apply all
          </button>

          <button
            type="button"
            onClick={() => onSkipRecommendations?.()}
            className="cf-btn cf-btn--secondary"
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
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
        {title}
      </p>

      <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
        {itemTitles.length ? itemTitles.join(", ") : "No recommendations."}
      </p>

      {showAction ? (
        <button
          type="button"
          onClick={() => onApply?.()}
          className="cf-btn cf-btn--secondary cf-btn--sm mt-3 w-fit"
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
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
        {title}
      </p>

      <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
        {itemTitle || "No recommendation."}
      </p>

      {showAction ? (
        <button
          type="button"
          onClick={() => onApply?.()}
          className="cf-btn cf-btn--secondary cf-btn--sm mt-3 w-fit"
        >
          Use
        </button>
      ) : null}
    </div>
  );
}
