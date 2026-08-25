export default function PublicProfileCreationGridView({
  engagementMessage = "",
  hasCreations = false,
  creationSlots = [],
  emptyTitle = "No public creations yet",
  emptyDescription =
    "Public approved creations from this creator will appear here.",
} = {}) {
  return (
    <>
      {engagementMessage ? (
        <p className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {engagementMessage}
        </p>
      ) : null}

      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {hasCreations ? (
          creationSlots
        ) : (
          <div className="rounded-[var(--radius-md)] border border-dashed border-white/10 bg-black/25 p-8 text-center sm:col-span-2 lg:col-span-3 2xl:col-span-4">
            <p className="font-display text-3xl">{emptyTitle}</p>
            <p className="mx-auto mt-3 max-w-2xl leading-7 text-[var(--ink-dim)]">
              {emptyDescription}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
