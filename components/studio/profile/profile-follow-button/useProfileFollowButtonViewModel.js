import { useRouter } from "next/navigation";
import { useState } from "react";

import { setProfileFollowByUsername } from "@/lib/client/studio/profile/profileFollowClient";

export function useProfileFollowButtonViewModel({
  username,
  initialIsFollowing = false,
  canFollow = false,
  onFollowChange,
} = {}) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [status, setStatus] = useState("idle");
  const router = useRouter();

  async function toggleFollow() {
    if (!canFollow || status === "saving") {
      return;
    }

    setStatus("saving");

    try {
      const data = await setProfileFollowByUsername({
        username,
        active: !isFollowing,
      });

      const nextIsFollowing = Boolean(data?.isFollowing);

      setIsFollowing(nextIsFollowing);
      onFollowChange?.(data || null);
      router.refresh();
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  return {
    isVisible: Boolean(canFollow),
    isFollowing,
    isSaving: status === "saving",
    onToggleFollow: toggleFollow,
  };
}
