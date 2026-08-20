"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { createWalletProfileDraft } from "@/lib/client/studio/wallet/walletClient";
import WalletProfileEditor from "../WalletProfileEditor";
import {
  WALLET_PROFILE_CONTENT_RATING_OPTIONS,
  WALLET_PROFILE_CREATION_TYPE,
  WALLET_PROFILE_VISIBILITY_OPTIONS,
  createWalletProfileBuilderDraft,
  resolveWalletProfileCreationTitle,
} from "./WalletProfileBuilder.contract";
import { validateWalletProfileEditorValue } from "../wallet-profile-editor/WalletProfileEditor.contract";

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function useWalletProfileBuilderViewModel({ initialDraft = null } = {}) {
  const router = useRouter();
  const [draft, setDraft] = useState(
    () => initialDraft || createWalletProfileBuilderDraft()
  );
  const [saveStatus, setSaveStatus] = useState("idle");
  const [saveMessage, setSaveMessage] = useState("");

  const validation = useMemo(
    () => validateWalletProfileEditorValue(draft.walletProfile),
    [draft.walletProfile]
  );

  const resolvedTitle = resolveWalletProfileCreationTitle({
    creationTitle: draft.title,
    profileTitle: draft.walletProfile?.title,
  });

  const saveDisabled =
    saveStatus === "saving" || !resolvedTitle || validation.errors.length > 0;

  function updateIdentity(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function updateProfile(nextProfile) {
    setDraft((current) => ({ ...current, walletProfile: nextProfile }));
  }

  async function save() {
    if (saveDisabled) return;

    setSaveStatus("saving");
    setSaveMessage("");

    try {
      const payload = await createWalletProfileDraft({
        type: WALLET_PROFILE_CREATION_TYPE,
        title: resolvedTitle,
        description:
          normalizeString(draft.description) ||
          normalizeString(draft.walletProfile?.description) ||
          "A reusable Crestfall gameplay Wallet Profile.",
        visibility: draft.visibility,
        status: "DRAFT",
        contentRating: draft.contentRating,
        canonStatus: "NONE",
        data: {
          wallet_profile: validation.normalized,
          builder: "WALLET_PROFILE_BUILDER",
          builder_version: "0.1",
        },
      });

      const creation = payload?.data?.creation || payload?.creation || null;
      if (!creation?.id) {
        throw new Error("Wallet Profile was saved without a creation ID.");
      }

      setSaveStatus("saved");
      setSaveMessage("Wallet Profile draft saved.");
      router.push(`/studio/my-creations/${creation.id}/edit`);
    } catch (error) {
      setSaveStatus("error");
      setSaveMessage(
        error?.message || "Wallet Profile draft could not be saved."
      );
    }
  }

  return {
    title: resolvedTitle,
    description: draft.description,
    visibility: draft.visibility,
    contentRating: draft.contentRating,
    visibilityOptions: WALLET_PROFILE_VISIBILITY_OPTIONS,
    contentRatingOptions: WALLET_PROFILE_CONTENT_RATING_OPTIONS,
    editor: (
      <WalletProfileEditor
        value={draft.walletProfile}
        onChange={updateProfile}
      />
    ),
    saveDisabled,
    saveStatus,
    saveMessage,
    errorCount: validation.errors.length,
    warningCount: validation.warnings.length,
    onUpdateIdentity: updateIdentity,
    onSave: save,
  };
}
