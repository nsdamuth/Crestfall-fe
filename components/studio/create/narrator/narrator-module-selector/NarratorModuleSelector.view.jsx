export default function NarratorModuleSelectorView({
  sectionEyebrow = "Official Starter Modules",
  sectionTitle = "Build from Modules",
  sectionDescription = "",
  responseEyebrow = "Response Direction",
  responseTitle = "Narrator Control",
  responseDescription = "",
  responseDirectionGroups = [],
  showEnsembleLimit = false,
  ensembleLimitLabel = "Ensemble Character Limit",
  ensembleLimitDescription = "",
  ensembleLimitOptions = [],
  safeDefaultNote = "",
  moduleGroups = [],
  onSelectResponseDirection = null,
  onSelectEnsembleCharacterLimit = null,
  onSelectModule = null,
} = {}) {
  return (
    <section className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-5">
      {sectionEyebrow ? (
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold-ornament)]">
          {sectionEyebrow}
        </p>
      ) : null}

      {sectionTitle ? (
        <h3 className="mt-2 font-display text-3xl">{sectionTitle}</h3>
      ) : null}

      {sectionDescription ? (
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--ink-dim)]">
          {sectionDescription}
        </p>
      ) : null}

      <div className="mt-6 rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/25 bg-black/35 p-5">
        {responseEyebrow ? (
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold-ornament)]">
            {responseEyebrow}
          </p>
        ) : null}

        {responseTitle ? (
          <h4 className="mt-2 font-display text-2xl">{responseTitle}</h4>
        ) : null}

        {responseDescription ? (
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--ink-dim)]">
            {responseDescription}
          </p>
        ) : null}

        <div className="mt-6 space-y-6">
          {(Array.isArray(responseDirectionGroups)
            ? responseDirectionGroups
            : []
          ).map((group) => (
            <div key={group?.id || group?.label}>
              <p className="text-sm uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
                {group?.label || "Response Option"}
              </p>

              {group?.description ? (
                <p className="mt-1 text-xs leading-5 text-[var(--ink-dim)]">
                  {group.description}
                </p>
              ) : null}

              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {(Array.isArray(group?.options) ? group.options : []).map(
                  (option) => (
                    <button
                      key={option?.id || String(option?.value)}
                      type="button"
                      onClick={() =>
                        onSelectResponseDirection?.(
                          group?.id,
                          option?.value
                        )
                      }
                      className={`rounded-xl border p-4 text-left transition ${
                        option?.active
                          ? "border-[var(--gold-ornament)]/60 bg-[var(--gold-ornament)]/15 text-[var(--ink)]"
                          : "border-white/10 bg-black/35 text-[var(--ink-dim)] hover:border-[var(--gold-ornament)]/35 hover:text-[var(--ink)]"
                      }`}
                    >
                      <p className="text-sm font-medium">
                        {option?.title || "Option"}
                      </p>

                      {option?.body ? (
                        <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">
                          {option.body}
                        </p>
                      ) : null}
                    </button>
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        {showEnsembleLimit ? (
          <div className="mt-6 border-t border-white/10 pt-5">
            <p className="text-sm uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
              {ensembleLimitLabel}
            </p>

            {ensembleLimitDescription ? (
              <p className="mt-1 text-xs leading-5 text-[var(--ink-dim)]">
                {ensembleLimitDescription}
              </p>
            ) : null}

            <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {(Array.isArray(ensembleLimitOptions)
                ? ensembleLimitOptions
                : []
              ).map((option) => (
                <button
                  key={option?.id || String(option?.value)}
                  type="button"
                  onClick={() =>
                    onSelectEnsembleCharacterLimit?.(option?.value)
                  }
                  className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                    option?.active
                      ? "border-[var(--gold-ornament)]/60 bg-[var(--gold-ornament)]/15 text-[var(--ink)]"
                      : "border-white/10 bg-black/35 text-[var(--ink-dim)] hover:border-[var(--gold-ornament)]/35 hover:text-[var(--ink)]"
                  }`}
                >
                  {option?.title || "Limit"}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {safeDefaultNote ? (
          <p className="mt-5 text-xs leading-5 text-[var(--ink-dim)]">
            {safeDefaultNote}
          </p>
        ) : null}
      </div>

      <div className="mt-6 space-y-6">
        {(Array.isArray(moduleGroups) ? moduleGroups : []).map((group) => (
          <div key={group?.id || group?.label}>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
                  {group?.label || "Module Group"}
                </p>
                {group?.description ? (
                  <p className="mt-1 text-xs leading-5 text-[var(--ink-dim)]">
                    {group.description}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {(Array.isArray(group?.modules) ? group.modules : []).map(
                (module) => (
                  <button
                    key={module?.id || module?.title}
                    type="button"
                    onClick={() => onSelectModule?.(group?.id, module?.id)}
                    className={`rounded-xl border p-4 text-left transition ${
                      module?.active
                        ? "border-[var(--gold-ornament)]/60 bg-[var(--gold-ornament)]/15 text-[var(--ink)]"
                        : "border-white/10 bg-black/35 text-[var(--ink-dim)] hover:border-[var(--gold-ornament)]/35 hover:text-[var(--ink)]"
                    }`}
                  >
                    <p className="text-sm font-medium">
                      {module?.title || "Module"}
                    </p>
                    {module?.body ? (
                      <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">
                        {module.body}
                      </p>
                    ) : null}
                  </button>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
