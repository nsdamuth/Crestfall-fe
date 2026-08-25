import KitBadge from "@/components/kit/KitBadge";
import {
  kitBadgeCanonCanvasFixture,
  kitBadgeCanonArtFixture,
  kitBadgeStatusCanvasFixture,
  kitBadgeStatusArtFixture,
  kitBadgeMetaFixture,
  kitBadgeLongestLabelFixture,
} from "@/components/kit/badge/KitBadge.fixtures";

export function CanonOnCanvas() {
  return <KitBadge {...kitBadgeCanonCanvasFixture} />;
}

export function CanonOnArt() {
  return (
    <div className="rounded-[var(--radius-md)] bg-[var(--surface-4)] p-[var(--space-4)]">
      <KitBadge {...kitBadgeCanonArtFixture} />
    </div>
  );
}

export function StatusOnCanvas() {
  return <KitBadge {...kitBadgeStatusCanvasFixture} />;
}

export function StatusOnArt() {
  return (
    <div className="rounded-[var(--radius-md)] bg-[var(--surface-4)] p-[var(--space-4)]">
      <KitBadge {...kitBadgeStatusArtFixture} />
    </div>
  );
}

export function Meta() {
  return <KitBadge {...kitBadgeMetaFixture} />;
}

export function LongestLabel() {
  return <KitBadge {...kitBadgeLongestLabelFixture} />;
}
