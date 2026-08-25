import {
  Heart,
  Image as ImageIcon,
  MessageCircle,
  Video,
} from "lucide-react";

const STAT_ICON_BY_ID = {
  likes: Heart,
  messages: MessageCircle,
  images: ImageIcon,
  videos: Video,
};

function formatNumber(value) {
  const number = Number(value || 0);

  if (number >= 1000000) return `${(number / 1000000).toFixed(1)}m`;
  if (number >= 1000) return `${(number / 1000).toFixed(1)}k`;

  return `${number}`;
}

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

        return (
          <span key={item.id} className="inline-flex items-center gap-1">
            <Icon size={compact ? 12 : 14} />
            {formatNumber(item.value)}
          </span>
        );
      })}
    </div>
  );
}
