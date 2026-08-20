"use client";

import { useMemo, useState } from "react";

import {
  WALLET_PROFILE_LIMITS,
  normalizeWalletCurrencyDefinition,
  normalizeWalletProfileEditorValue,
  validateWalletProfileEditorValue,
} from "./WalletProfileEditor.contract";

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function parseList(value) {
  return String(value || "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function toSafeInteger(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : fallback;
}

export function useWalletProfileEditorViewModel({ value = {}, onChange = null } = {}) {
  const [jsonEditorOpen, setJsonEditorOpen] = useState(false);
  const profile = useMemo(() => normalizeWalletProfileEditorValue(value), [value]);
  const validation = useMemo(
    () => validateWalletProfileEditorValue(value),
    [value]
  );

  function commit(nextProfile) {
    onChange?.(normalizeWalletProfileEditorValue(nextProfile));
  }

  function updateProfileField(field, nextValue) {
    commit({
      ...profile,
      [field]: nextValue,
    });
  }

  function addCurrency() {
    const nextIndex = profile.currencies.length;
    if (nextIndex >= WALLET_PROFILE_LIMITS.maxCurrencies) return;

    commit({
      ...profile,
      currencies: [
        ...profile.currencies,
        normalizeWalletCurrencyDefinition(
          {
            id: `currency.${nextIndex + 1}`,
            title: `Currency ${nextIndex + 1}`,
            enabled: true,
            startingBalance: 0,
            minimumBalance: 0,
            maximumBalance: 1000000,
          },
          nextIndex
        ),
      ],
    });
  }

  function removeCurrency(currencyIndex) {
    commit({
      ...profile,
      currencies: profile.currencies.filter(
        (_currency, index) => index !== currencyIndex
      ),
    });
  }

  function updateCurrencyField(currencyIndex, field, nextValue) {
    const currencies = profile.currencies.map((currency, index) => {
      if (index !== currencyIndex) return currency;

      const valueByField = {
        id: normalizeString(nextValue).toLowerCase(),
        startingBalance: toSafeInteger(nextValue, currency.startingBalance),
        minimumBalance: toSafeInteger(nextValue, currency.minimumBalance),
        maximumBalance: toSafeInteger(nextValue, currency.maximumBalance),
        tags: parseList(nextValue),
      };

      return normalizeWalletCurrencyDefinition(
        {
          ...currency,
          [field]: Object.hasOwn(valueByField, field)
            ? valueByField[field]
            : nextValue,
        },
        index
      );
    });

    commit({ ...profile, currencies });
  }

  function applyJsonProfile(nextProfile) {
    commit(nextProfile);
    setJsonEditorOpen(false);
  }

  return {
    viewProps: {
      profile,
      errors: validation.errors,
      warnings: validation.warnings,
      metrics: validation.metrics,
      currencyLimit: WALLET_PROFILE_LIMITS.maxCurrencies,
      onUpdateProfileField: updateProfileField,
      onAddCurrency: addCurrency,
      onRemoveCurrency: removeCurrency,
      onUpdateCurrencyField: updateCurrencyField,
      onOpenJsonEditor: () => setJsonEditorOpen(true),
    },
    jsonEditorProps: jsonEditorOpen
      ? {
          value: profile,
          onApply: applyJsonProfile,
          onClose: () => setJsonEditorOpen(false),
        }
      : null,
  };
}
