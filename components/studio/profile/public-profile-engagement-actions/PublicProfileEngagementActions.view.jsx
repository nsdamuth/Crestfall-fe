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
        <p className="mb-3 rounded-[var(--radius-md)] border border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] px-4 py-3 text-sm text-[var(--status-danger)]">
          {errorMessage}
        </p>
      ) : null}

      <CreatorEngagementActionsView {...engagementActions} />
    </div>
  );
}
