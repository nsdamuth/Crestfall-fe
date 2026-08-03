import { feApiRequest } from "@/lib/server/api/feApiRequest";

function normalizeLimit(value) {
  const parsed = Number.parseInt(
    String(value || ""),
    10
  );

  if (!Number.isFinite(parsed)) {
    return 20;
  }

  return Math.max(1, Math.min(parsed, 100));
}

export async function getPublicProfileDonationEvents({
  profileId,
  limit = 20,
}) {
  const normalizedProfileId =
    typeof profileId === "string"
      ? profileId.trim()
      : "";

  if (
    !normalizedProfileId ||
    normalizedProfileId === "undefined" ||
    normalizedProfileId === "null"
  ) {
    return {
      donationEvents: [],
      loadError: null,
    };
  }

  try {
    const payload = await feApiRequest({
      path: `/api/profile/donations?profileId=${encodeURIComponent(
        normalizedProfileId
      )}&limit=${normalizeLimit(limit)}`,
    });

    return {
      donationEvents:
        payload?.data?.donationEvents || [],
      loadError: null,
    };
  } catch (error) {
    return {
      donationEvents: [],
      loadError:
        error.message ||
        "Donation events could not be loaded.",
    };
  }
}