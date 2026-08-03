export async function createCreation(supabase, userId, input) {
  return disabledCreationBypassError("createCreation");
}

function disabledCreationBypassError(functionName) {
  return {
    data: null,
    error: new Error(
      `${functionName} is disabled. Creations must go through PostGraphile-backed repositories.`
    ),
  };
}