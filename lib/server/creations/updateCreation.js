export async function updateCreation(supabase, userId, creationId, updates) {
  const updatePayload = {
    ...updates,
    updated_at: new Date().toISOString(),
  };

  return disabledCreationBypassError("updateCreation");
}


function disabledCreationBypassError(functionName) {
  return {
    data: null,
    error: new Error(
      `${functionName} is disabled. Creations must go through PostGraphile-backed repositories.`
    ),
  };
}