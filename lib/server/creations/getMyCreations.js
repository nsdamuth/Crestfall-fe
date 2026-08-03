export async function getMyCreations(
  supabase,
  userId,
  { type = null, status = null } = {}
) {
  return disabledCreationBypassError("getMyCreations");
}

function disabledCreationBypassError(functionName) {
  return {
    data: null,
    error: new Error(
      `${functionName} is disabled. Creations must go through PostGraphile-backed repositories.`
    ),
  };
}