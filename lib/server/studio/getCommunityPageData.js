import { feApiRequest } from "@/lib/server/api/feApiRequest";

function getFailureMessage(result) {
  if (result.status !== "rejected") {
    return null;
  }

  return (
    result.reason?.payload?.error?.message ||
    result.reason?.message ||
    "Community data could not be loaded."
  );
}

export async function getCommunityPageData() {
  const [
    creationsResult,
    creatorsResult,
  ] = await Promise.allSettled([
    feApiRequest({
      path: "/api/community/creations",
    }),

    feApiRequest({
      path: "/api/community/creators",
    }),
  ]);

  return {
    creations:
      creationsResult.status === "fulfilled"
        ? creationsResult.value?.data
            ?.creations || []
        : [],

    creators:
      creatorsResult.status === "fulfilled"
        ? creatorsResult.value?.data
            ?.creators || []
        : [],

    loadError:
      getFailureMessage(creationsResult) ||
      getFailureMessage(creatorsResult) ||
      null,
  };
}