export async function getOwnedCreationById(supabase, userId, creationId) {
  return disabledCreationBypassError("getOwnedCreationById");
}

function disabledCreationBypassError(functionName) {
  return {
    data: null,
    error: new Error(
      `${functionName} is disabled. Creations must go through PostGraphile-backed repositories.`
    ),
  };
}