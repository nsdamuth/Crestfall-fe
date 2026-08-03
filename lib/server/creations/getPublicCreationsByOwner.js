import {
  PROFILE_SHOWCASE_CREATION_TYPES,
  isProfileShowcaseCreationType,
} from "@/lib/shared/creations/creationTypePolicy";

export async function getPublicCreationsByOwner(
  supabase,
  ownerId,
  { type = null, contentRating = null } = {}
) {
  return disabledCreationBypassError("getPublicCreationsByOwnergetPublicCreationsByOwner");
}

function disabledCreationBypassError(functionName) {
  return {
    data: null,
    error: new Error(
      `${functionName} is disabled. Creations must go through PostGraphile-backed repositories.`
    ),
  };
}