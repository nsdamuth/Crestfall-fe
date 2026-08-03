"use client";

import { useEffect, useMemo, useState } from "react";
import PublicProfileDonateButtonView from "@/components/studio/profile/public-profile-donate-button/PublicProfileDonateButton.view";
import {
  PUBLIC_PROFILE_DONATE_BUTTON_FIXTURES,
  getPublicProfileDonateButtonFixture,
} from "@/components/studio/profile/public-profile-donate-button/PublicProfileDonateButton.fixtures";
import { PUBLIC_PROFILE_DONATION_MESSAGE_TONES } from "@/components/studio/profile/public-profile-donate-button/PublicProfileDonateButton.contract";

function toNumber(value) {
  const parsed = Number.parseInt(String(value || ""), 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function PublicProfileDonateButtonPreviewClient() {
  const [fixtureId, setFixtureId] = useState(
    PUBLIC_PROFILE_DONATE_BUTTON_FIXTURES[0].id
  );
  const fixture = getPublicProfileDonateButtonFixture(fixtureId);
  const [state, setState] = useState(fixture.props);

  useEffect(() => {
    setState(fixture.props);
  }, [fixture]);

  const amountGross = toNumber(state.amountValue);
  const derivedState = useMemo(
    () => ({
      ...state,
      amountNet: amountGross,
      taxAmount: 0,
      taxPercent: 0,
      submitLabel: state.isBusy
        ? "Sending..."
        : `Donate ${amountGross || state.minimumDonation || 100} Coins`,
    }),
    [amountGross, state]
  );

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-2xl border border-white/10 bg-black/35 p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Loom Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Public Profile Donate Button
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted)]">
            Preview actions update local state only. No Studio account is loaded,
            no donation request is sent, no coins are spent, and no profile is
            refreshed.
          </p>

          <label className="mt-5 block max-w-sm">
            <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
              Fixture
            </span>
            <select
              value={fixtureId}
              onChange={(event) => setFixtureId(event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-[var(--foreground)] outline-none"
            >
              {PUBLIC_PROFILE_DONATE_BUTTON_FIXTURES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-black/35 p-6">
          <PublicProfileDonateButtonView
            {...derivedState}
            onOpenDonation={() =>
              setState((current) => ({ ...current, isOpen: true }))
            }
            onCloseDonation={() =>
              setState((current) => ({ ...current, isOpen: false }))
            }
            onChangeAmount={(nextValue) =>
              setState((current) => ({
                ...current,
                amountValue: nextValue,
                statusMessage: "",
                statusTone: "",
              }))
            }
            onChangeMessage={(nextValue) =>
              setState((current) => ({ ...current, messageValue: nextValue }))
            }
            onChangeAnonymous={(nextValue) =>
              setState((current) => ({ ...current, isAnonymous: nextValue }))
            }
            onSubmitDonation={() => {
              if (amountGross < (state.minimumDonation || 100)) {
                setState((current) => ({
                  ...current,
                  statusMessage: `Minimum donation is ${
                    current.minimumDonation || 100
                  } coins.`,
                  statusTone: PUBLIC_PROFILE_DONATION_MESSAGE_TONES.ERROR,
                }));
                return;
              }

              setState((current) => ({
                ...current,
                isSuccess: true,
                statusMessage: `Donation sent. ${
                  current.recipientHandle || "This creator"
                } received ${amountGross} coins.`,
                statusTone: PUBLIC_PROFILE_DONATION_MESSAGE_TONES.SUCCESS,
                messageValue: "",
              }));
            }}
          />
        </div>
      </div>
    </main>
  );
}
