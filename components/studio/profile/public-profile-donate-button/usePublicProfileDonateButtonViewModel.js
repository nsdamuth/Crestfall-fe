"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { donateProfileCoins } from "@/lib/client/studio/profile/creatorDonationClient";
import { useStudioAccount } from "@/components/studio/StudioAccountProvider";
import { PUBLIC_PROFILE_DONATION_MESSAGE_TONES } from "./PublicProfileDonateButton.contract";

export const PUBLIC_PROFILE_MIN_DONATION = 100;
export const PUBLIC_PROFILE_DONATION_TAX_BPS = 0;

export function calculatePublicProfileDonationTax(amountGross) {
  return Math.floor(
    (amountGross * PUBLIC_PROFILE_DONATION_TAX_BPS) / 10000
  );
}

export function normalizePublicProfileDonationAmount(value) {
  const number = Number.parseInt(String(value || ""), 10);

  return Number.isFinite(number) ? number : 0;
}

export function usePublicProfileDonateButtonViewModel({ profile } = {}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(PUBLIC_PROFILE_MIN_DONATION);
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [status, setStatus] = useState("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const {
    coinBalance,
    accountStatus,
    accountError,
    refreshAccount,
    setCoinBalanceFromServer,
  } = useStudioAccount();

  const profileId = String(profile?.id || "").trim();
  const recipientHandle = String(profile?.username || "creator");

  async function openDonation() {
    setOpen(true);
    setStatus("loading_balance");
    setStatusMessage("");

    try {
      await refreshAccount();
      setStatus("idle");
    } catch (error) {
      setStatus("error");
      setStatusMessage(
        error?.message || "Coin balance could not be loaded."
      );
    }
  }

  function closeDonation() {
    setOpen(false);
  }

  async function submitDonation() {
    const amountGross = normalizePublicProfileDonationAmount(amount);

    if (amountGross < PUBLIC_PROFILE_MIN_DONATION) {
      setStatus("error");
      setStatusMessage(
        `Minimum donation is ${PUBLIC_PROFILE_MIN_DONATION} coins.`
      );
      return;
    }

    if (amountGross > coinBalance) {
      setStatus("error");
      setStatusMessage("You do not have enough coins.");
      return;
    }

    setStatus("submitting");
    setStatusMessage("");

    try {
      const donation = await donateProfileCoins({
        recipientProfileId: profileId,
        amountGross,
        message,
        isAnonymous,
      });

      setStatus("success");

      if (!setCoinBalanceFromServer(donation?.senderBalance)) {
        refreshAccount().catch(() => {});
      }

      setStatusMessage(
        `Donation sent. ${profile?.username || "This creator"} received ${
          donation?.amountNet ?? amountGross
        } coins.`
      );
      setMessage("");
      router.refresh();
    } catch (error) {
      setStatus("error");
      setStatusMessage(error?.message || "Donation could not be completed.");
    }
  }

  const amountGross = normalizePublicProfileDonationAmount(amount);
  const taxAmount = calculatePublicProfileDonationTax(amountGross);
  const amountNet = Math.max(amountGross - taxAmount, 0);
  const isBusy = status === "loading_balance" || status === "submitting";
  const isSuccess = status === "success";
  const fallbackAccountError =
    !statusMessage && accountStatus === "error" && accountError
      ? String(accountError)
      : "";
  const displayStatusMessage = statusMessage || fallbackAccountError;

  return {
    isVisible: Boolean(profileId),
    isOpen: open,
    recipientHandle,
    minimumDonation: PUBLIC_PROFILE_MIN_DONATION,
    amountValue: amount,
    messageValue: message,
    isAnonymous,
    isBusy,
    isSuccess,
    balanceLabel: accountStatus === "loading" ? "Loading..." : coinBalance,
    amountNet,
    taxAmount,
    taxPercent: PUBLIC_PROFILE_DONATION_TAX_BPS / 100,
    submitLabel: isBusy
      ? "Sending..."
      : `Donate ${amountGross || PUBLIC_PROFILE_MIN_DONATION} Coins`,
    statusMessage: displayStatusMessage,
    statusTone: displayStatusMessage
      ? status === "success"
        ? PUBLIC_PROFILE_DONATION_MESSAGE_TONES.SUCCESS
        : PUBLIC_PROFILE_DONATION_MESSAGE_TONES.ERROR
      : "",
    onOpenDonation: openDonation,
    onCloseDonation: closeDonation,
    onChangeAmount: setAmount,
    onChangeMessage: setMessage,
    onChangeAnonymous: setIsAnonymous,
    onSubmitDonation: submitDonation,
  };
}
