export const KIT_RAIL_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable portable UI boundary for the shared horizontally scrolling
 * rail kit piece (docs/SPRINT-F-PLAN.md, branch design/rail, 10 Aug
 * 2026). New package, contract authorized none to 1.0.0 at this
 * gate. It holds existing cards; no card-level work is part of this
 * contract.
 *
 * What the rail renders itself: the section root; the head row
 * (label, the short gold rule, View all, the head control seat, the
 * gold arrow pair from 700px up); the scrollport with its item
 * cells, snap, edge bleed, and trailing fade; the arrow enable and
 * disable state.
 *
 * What the rail delegates: everything inside the cards (children,
 * passed through untouched); the View all destination (onViewAll,
 * the page owns routing); the head control's entire behavior
 * (headControlSlot, the page owns its state); all data. The rail
 * fetches nothing, routes nothing, and holds no application state.
 *
 * Zero renderable children means the whole rail, head included,
 * renders nothing (docs/CRESTFALL-DESIGN-CONTEXT.md, the ruled
 * empty-rail law, matching the Continue strip and creator-card strip
 * precedents).
 *
 * @typedef {Object} KitRailViewProps
 * @property {string} label Head label text, rendered uppercase in gold. Also the rail's accessible name (aria-label on the section root).
 * @property {string} viewAllLabel Display text of the head link.
 * @property {(() => void)|null} onViewAll When null, the View all link does not render.
 * @property {import("react").ReactNode} headControlSlot The head control seat. Home fills it with the sort dropdown on the top rail only; every other rail leaves it null and the head renders correctly without it.
 * @property {import("react").ReactNode} children The cards, in order. Each direct child is wrapped in one sized item cell. Zero renderable children means the whole rail, head included, renders nothing.
 */

export {};
