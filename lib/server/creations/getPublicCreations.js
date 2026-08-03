import {
  COMMUNITY_DISCOVERABLE_CREATION_TYPES,
  isCommunityDiscoverableCreationType,
} from "@/lib/shared/creations/creationTypePolicy";

export async function getPublicCreations(
  supabase,
  { type = null, contentRating = null } = {}
) {
  return disabledCreationBypassError("getPublicCreations");
}

function disabledCreationBypassError(functionName) {
  return {
    data: null,
    error: new Error(
      `${functionName} is disabled. Creations must go through PostGraphile-backed repositories.`
    ),
  };
}