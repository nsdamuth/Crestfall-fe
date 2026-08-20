export default function MechanicsCommandDomainQueryView({
  domainQuery,
  argumentOptions,
  onPatch,
  onAddBinding,
  onPatchBinding,
  onRemoveBinding,
}) {
  return (
    <div className="rounded-xl border border-[var(--muted-gold)]/20 bg-black/20 p-4">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
          Domain Query
        </p>
        <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
          Route this creator-authored command to a registered read-only Crestfall domain query.
          Crestfall owns the typed domain/operation contract; the creator owns the command name.
          Queries do not mutate state or grant execution authority.
        </p>
      </div>

      <label className="mt-4 flex items-center gap-3 text-sm text-[var(--muted)]">
        <input
          type="checkbox"
          checked={domainQuery.enabled}
          onChange={(event) => onPatch({ enabled: event.target.checked })}
        />
        Enable typed domain query
      </label>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-[var(--muted)]">
          <span>Domain</span>
          <input
            value={domainQuery.domain}
            onChange={(event) => onPatch({ domain: event.target.value })}
            placeholder="ABILITY_SPELL"
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]"
          />
          <span className="text-[11px] leading-5 text-[var(--muted)]">
            Typed platform domain identifier. Runtime rejects unregistered domain/operation pairs.
          </span>
        </label>

        <label className="grid gap-2 text-sm text-[var(--muted)]">
          <span>Operation</span>
          <input
            value={domainQuery.operation}
            onChange={(event) => onPatch({ operation: event.target.value })}
            placeholder="QUERY_AVAILABILITY"
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]"
          />
          <span className="text-[11px] leading-5 text-[var(--muted)]">
            Domain-owned read operation. This field does not define or execute game rules by itself.
          </span>
        </label>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[var(--foreground)]">Argument bindings</p>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Map creator-authored command arguments into generic query parameters.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddBinding}
          className="rounded-lg border border-white/10 px-3 py-2 text-xs text-[var(--foreground)] transition hover:border-[var(--muted-gold)]/40"
        >
          Add binding
        </button>
      </div>

      <div className="mt-3 grid gap-3">
        {domainQuery.argumentBindings.map((binding, index) => (
          <div
            key={`${binding.parameter}-${index}`}
            className="grid gap-3 rounded-xl border border-white/10 bg-black/25 p-3 md:grid-cols-[1fr_1fr_auto]"
          >
            <label className="grid gap-2 text-xs text-[var(--muted)]">
              <span>Query parameter</span>
              <input
                value={binding.parameter}
                onChange={(event) =>
                  onPatchBinding(index, { parameter: event.target.value })
                }
                placeholder="subject"
                className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-[var(--foreground)] outline-none focus:border-[var(--muted-gold)]"
              />
            </label>

            <label className="grid gap-2 text-xs text-[var(--muted)]">
              <span>Command argument</span>
              <select
                value={binding.sourceArgumentName}
                onChange={(event) =>
                  onPatchBinding(index, { sourceArgumentName: event.target.value })
                }
                className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-[var(--foreground)] outline-none focus:border-[var(--muted-gold)]"
              >
                <option value="">Select argument</option>
                {argumentOptions.map((argument) => (
                  <option key={argument.name} value={argument.name}>
                    {argument.label} ({argument.type})
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              onClick={() => onRemoveBinding(index)}
              className="self-end rounded-lg border border-white/10 px-3 py-2 text-xs text-[var(--muted)] transition hover:border-red-400/40 hover:text-red-300"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
