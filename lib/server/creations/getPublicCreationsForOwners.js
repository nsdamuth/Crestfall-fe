import { PROFILE_SHOWCASE_CREATION_TYPES } from "@/lib/shared/creations/creationTypePolicy";

export async function getPublicCreationsForOwners(supabase, ownerIds = []) {
  return disabledCreationBypassError("disabledCreationBypassError");
}

function disabledCreationBypassError(functionName) {
  return {
    data: null,
    error: new Error(
      `${functionName} is disabled. Creations must go through PostGraphile-backed repositories.`
    ),
  };
}