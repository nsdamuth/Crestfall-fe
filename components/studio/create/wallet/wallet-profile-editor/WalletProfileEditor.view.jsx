"use client";

import { Braces, Coins, Plus, Trash2 } from "lucide-react";

function Label({ children }) {
  return (
    <label className="text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)]">
      {children}
    </label>
  );
}

const inputClass =
  "mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]/50";

function TextInput({ value = "", onChange = null, type = "text", ...props }) {
  return (
    <input
      {...props}
      type={type}
      className={inputClass}
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
    />
  );
}

function TextArea({ value = "", onChange = null, rows = 3, ...props }) {
  return (
    <textarea
      {...props}
      rows={rows}
      className={inputClass}
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
    />
  );
}

function ValidationPanel({ errors = [], warnings = [] }) {
  if (!errors.length && !warnings.length) return null;

  return (
    <div className="grid gap-3">
      {errors.length ? (
        <div className="rounded-xl border border-red-300/20 bg-red-500/10 p-4 text-xs text-red-100">
          <p className="font-semibold">Errors</p>
          <ul className="mt-2 space-y-1">
            {errors.map((entry, index) => (
              <li key={`${entry.code}-${entry.path}-${index}`}>
                {entry.path}: {entry.message}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {warnings.length ? (
        <div className="rounded-xl border border-amber-300/20 bg-amber-500/10 p-4 text-xs text-amber-100">
          <p className="font-semibold">Warnings</p>
          <ul className="mt-2 space-y-1">
            {warnings.map((entry, index) => (
              <li key={`${entry.code}-${entry.path}-${index}`}>
                {entry.path}: {entry.message}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export default function WalletProfileEditorView({
  profile = {},
  errors = [],
  warnings = [],
  metrics = {},
  currencyLimit = 0,
  onUpdateProfileField = null,
  onAddCurrency = null,
  onRemoveCurrency = null,
  onUpdateCurrencyField = null,
  onOpenJsonEditor = null,
}) {
  const currencies = Array.isArray(profile.currencies) ? profile.currencies : [];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[var(--muted-gold)]/20 bg-black/35 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[var(--muted-gold)]">
              <Coins size={18} />
              <p className="text-xs uppercase tracking-[0.2em]">
                Gameplay Wallet Definition
              </p>
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
              Author reusable currencies and their starting and allowed balance
              bounds. Live balances remain isolated actor-owned Story state.
              Crestfall Studio Coins are not part of this profile.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpenJsonEditor?.()}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-2 text-xs uppercase tracking-[0.14em] text-[var(--muted-gold)]"
          >
            <Braces size={15} />
            JSON Editor & AI Guide
          </button>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div>
            <Label>Profile title</Label>
            <TextInput
              value={profile.title}
              onChange={(value) => onUpdateProfileField?.("title", value)}
              placeholder="Adventurer Wallet"
            />
          </div>

          <div className="flex items-end">
            <label className="flex min-h-[48px] items-center gap-3 text-sm text-[var(--foreground)]">
              <input
                type="checkbox"
                checked={profile.enabled !== false}
                onChange={(event) =>
                  onUpdateProfileField?.("enabled", event.target.checked)
                }
              />
              Profile enabled
            </label>
          </div>

          <div className="lg:col-span-2">
            <Label>Description</Label>
            <TextArea
              value={profile.description}
              onChange={(value) => onUpdateProfileField?.("description", value)}
              placeholder="Explain the currencies and balance rules this wallet supplies."
            />
          </div>
        </div>
      </section>

      <ValidationPanel errors={errors} warnings={warnings} />

      <section className="rounded-2xl border border-white/10 bg-black/30 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
              Currency Definitions
            </p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {metrics.enabledCurrencyDefinitionCount || 0} enabled ·{" "}
              {metrics.currencyDefinitionCount || currencies.length} total ·
              limit {currencyLimit}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onAddCurrency?.()}
            disabled={currencies.length >= currencyLimit}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.14em] text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus size={15} />
            Add Currency
          </button>
        </div>

        <div className="mt-5 space-y-5">
          {currencies.map((currency, currencyIndex) => (
            <article
              key={`${currency.id}-${currencyIndex}`}
              className="rounded-2xl border border-white/10 bg-black/25 p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-[var(--foreground)]">
                    {currency.title || currency.id || `Currency ${currencyIndex + 1}`}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
                    {currency.id || "Unidentified currency"} · wallet_currency_definition_v0
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onRemoveCurrency?.(currencyIndex)}
                  className="inline-flex items-center gap-2 rounded-xl border border-rose-300/20 px-3 py-2 text-xs text-rose-100"
                >
                  <Trash2 size={14} />
                  Remove
                </button>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div>
                  <Label>Currency ID</Label>
                  <TextInput
                    value={currency.id}
                    onChange={(value) =>
                      onUpdateCurrencyField?.(currencyIndex, "id", value)
                    }
                    placeholder="currency.gold"
                  />
                </div>

                <div>
                  <Label>Title</Label>
                  <TextInput
                    value={currency.title}
                    onChange={(value) =>
                      onUpdateCurrencyField?.(currencyIndex, "title", value)
                    }
                    placeholder="Gold"
                  />
                </div>

                <div>
                  <Label>Symbol</Label>
                  <TextInput
                    value={currency.symbol}
                    onChange={(value) =>
                      onUpdateCurrencyField?.(currencyIndex, "symbol", value)
                    }
                    placeholder="gp"
                  />
                </div>

                <div className="flex items-end">
                  <label className="flex min-h-[48px] items-center gap-3 text-sm text-[var(--foreground)]">
                    <input
                      type="checkbox"
                      checked={currency.enabled !== false}
                      onChange={(event) =>
                        onUpdateCurrencyField?.(
                          currencyIndex,
                          "enabled",
                          event.target.checked
                        )
                      }
                    />
                    Currency enabled
                  </label>
                </div>

                <div>
                  <Label>Starting balance</Label>
                  <TextInput
                    type="number"
                    step="1"
                    value={currency.startingBalance}
                    onChange={(value) =>
                      onUpdateCurrencyField?.(
                        currencyIndex,
                        "startingBalance",
                        value
                      )
                    }
                  />
                </div>

                <div>
                  <Label>Minimum balance</Label>
                  <TextInput
                    type="number"
                    step="1"
                    value={currency.minimumBalance}
                    onChange={(value) =>
                      onUpdateCurrencyField?.(
                        currencyIndex,
                        "minimumBalance",
                        value
                      )
                    }
                  />
                </div>

                <div>
                  <Label>Maximum balance</Label>
                  <TextInput
                    type="number"
                    step="1"
                    value={currency.maximumBalance}
                    onChange={(value) =>
                      onUpdateCurrencyField?.(
                        currencyIndex,
                        "maximumBalance",
                        value
                      )
                    }
                  />
                </div>

                <div>
                  <Label>Tags</Label>
                  <TextInput
                    value={(currency.tags || []).join(", ")}
                    onChange={(value) =>
                      onUpdateCurrencyField?.(currencyIndex, "tags", value)
                    }
                    placeholder="coin, standard"
                  />
                </div>

                <div className="md:col-span-2 xl:col-span-4">
                  <Label>Description</Label>
                  <TextArea
                    rows={2}
                    value={currency.description}
                    onChange={(value) =>
                      onUpdateCurrencyField?.(
                        currencyIndex,
                        "description",
                        value
                      )
                    }
                    placeholder="Explain what this currency represents."
                  />
                </div>
              </div>

              <p className="mt-4 text-xs leading-5 text-[var(--muted)]">
                A negative minimum balance is allowed when the creator intends a
                debt-like wallet. Purchases, prices, exchange rates, escrow, and
                reserved funds are separate economy layers and are not authored here.
              </p>
            </article>
          ))}

          {!currencies.length ? (
            <div className="rounded-xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-[var(--muted)]">
              No currencies are defined. Add a currency or use the JSON editor.
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
