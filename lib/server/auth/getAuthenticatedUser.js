export async function getAuthenticatedUser(supabase) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      user: null,
      error,
    };
  }

  return {
    user,
    error: null,
  };
}