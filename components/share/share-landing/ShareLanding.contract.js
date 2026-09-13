export const SHARE_LANDING_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable portable UI boundary for the public share landing (fe/share-og
 * brief 1, D2, RULED 13 Sep 2026). One composition serves the three
 * landing families from the URL research map (/c, /story, /adventure).
 * The View receives the card model already built by
 * components/kit/share/shareCardModel.js plus the one action the page
 * offers, and renders the card's content as page text: the featured
 * image, the kind badge (and Canon), the title, the creator byline, the
 * excerpt, and the action. It never reads the session, never builds a
 * URL, never decides the action label.
 *
 * Widths: single column inside the --space-5 gutter at 390 by 844 with
 * a full-width gold action at 44px; from 1024 up a 64rem container in
 * two columns, art left at 28rem, words and the action right.
 *
 * @typedef {Object} ShareLandingViewProps
 * @property {string} kindLabel display word for the kind (Character,
 *   Story, Adventure); empty renders no badge
 * @property {boolean} isCanon renders the Canon badge
 * @property {string} title
 * @property {string} byline "by @maker"
 * @property {string|null} creatorHref the maker's public profile; the
 *   byline renders as a link when present
 * @property {string} excerpt the card excerpt; empty renders nothing
 * @property {string} imageSrc the featured image (card derivative);
 *   empty renders the quiet no-image tile
 * @property {string} actionLabel "Play free" signed out, "Play" signed in
 * @property {string} actionHref the sign-in return link, or the play route
 * @property {string} errorMessage a served load error; renders in place
 *   of the card when set
 */

export {};
