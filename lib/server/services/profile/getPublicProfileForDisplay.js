function toPublicProfile(row) {
  if (!row) return null;

  return {
    id: row.id,
    username: row.username,
    display_name: row.display_name,
    displayName: row.display_name,
    bio: row.bio,
    avatar_url: row.avatar_url,
    avatarUrl: row.avatar_url,
    is_public: row.is_public,
    isPublic: row.is_public,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getPublicProfileForDisplay({
  profileRepository,
  username,
}) {
  const { data, error } = await profileRepository.getPublicByUsername({
    username,
  });

  if (error) {
    return {
      data: null,
      error,
    };
  }

  return {
    data: toPublicProfile(data),
    error: null,
  };
}