"use client";

import CreatorEngagementActionsView from "@/components/studio/community/creator-engagement-actions/CreatorEngagementActions.view";

export default function PublicProfileEngagementActionsView({
  isVisible = false,
  className = "mt-4",
  errorMessage = "",
  engagementActions = {},
}) {
  if (!isVisible) return null;

  return (
    <div className={className}>
      {errorMessage ? (
        <p className="mb-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {errorMessage}
        </p>
      ) : null}

      <CreatorEngagementActionsView {...engagementActions} />
    </div>
  );
}
