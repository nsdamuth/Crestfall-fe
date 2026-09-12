import {
  BookOpen,
  Heart,
  Image as ImageIcon,
  MessageCircle,
  Network,
} from "lucide-react";

import { formatCreationCardMetricCount } from "@/lib/shared/presentation/creationCardMetrics";

const STAT_ICON_BY_ID = {
  interactionCount: MessageCircle,
  likeCount: Heart,
  imageUseCount: ImageIcon,
  storyUseCount: BookOpen,
  externalCreationUseCount: Network,
};

export default function CreationStatsRowView({
  items = [],
  compact = false,
}) {
  if (!items.length) {
    return null;
  }

  return (
    <div
      className={`flex flex-wrap items-center gap-3 text-[var(--ink-dim)] ${
        compact ? "text-[11px]" : "text-xs"
      }`}
    >
      {items.map((item) => {
        const Icon = STAT_ICON_BY_ID[item.id];

        if (!Icon) {
          return null;
        }

        const value = formatCreationCardMetricCount(item.value);
        const accessibleLabel = `${item.label || "Usage"}: ${value}`;

        return (
          <span
            key={item.id}
            className="inline-flex items-center gap-1"
            aria-label={accessibleLabel}
            title={accessibleLabel}
          >
            <Icon size={compact ? 12 : 14} aria-hidden="true" />
            {value}
          </span>
        );
      })}
    </div>
  );
}
