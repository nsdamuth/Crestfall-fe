export default function ScenarioRecommendationsPanel({
  recommendations,
  onApplyAll,
  onApplyRequired,
  onApplyOptional,
  onApplyLocation,
  onApplyNarrator,
  onSkip,
}) {
  const {
    requiredCharacters,
    optionalCharacters,
    suggestedLocation,
    suggestedNarrator,
  } = recommendations;

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
            onClick={onApplyAll}
            className="cf-btn cf-btn--primary"
          >
            Apply all
          </button>

          <button
            type="button"
            onClick={onSkip}
            className="cf-btn cf-btn--secondary"
          >
            Skip
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-3 xl:grid-cols-2">
        <RecommendationGroup
          title="Required Characters"
          items={requiredCharacters}
          onApply={onApplyRequired}
        />

        <RecommendationGroup
          title="Optional Characters"
          items={optionalCharacters}
          onApply={onApplyOptional}
        />

        <RecommendationSingle
          title="Suggested Location"
          item={suggestedLocation}
          onApply={onApplyLocation}
        />

        <RecommendationSingle
          title="Suggested Narrator"
          item={suggestedNarrator}
          onApply={onApplyNarrator}
        />
      </div>
    </div>
  );
}

function RecommendationGroup({ title, items, onApply }) {
  return (
    <div className="min-w-0 rounded-xl border border-white/10 bg-black/25 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
        {title}
      </p>

      <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
        {items.length
          ? items.map((item) => item.title).join(", ")
          : "No recommendations."}
      </p>

      {items.length ? (
        <button
          type="button"
          onClick={onApply}
          className="cf-btn cf-btn--secondary cf-btn--sm mt-3 w-fit"
        >
          Apply
        </button>
      ) : null}
    </div>
  );
}

function RecommendationSingle({ title, item, onApply }) {
  return (
    <div className="min-w-0 rounded-xl border border-white/10 bg-black/25 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
        {title}
      </p>

      <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
        {item?.title || "No recommendation."}
      </p>

      {item?.id ? (
        <button
          type="button"
          onClick={onApply}
          className="cf-btn cf-btn--secondary cf-btn--sm mt-3 w-fit"
        >
          Use
        </button>
      ) : null}
    </div>
  );
}

