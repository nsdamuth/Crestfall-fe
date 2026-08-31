export const PUBLIC_HOME_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Static presentation boundary for the public Crestfall landing page.
 *
 * The View owns presentation only: brand treatment, hero composition,
 * feature storytelling, artwork placement, and legal/support links. It does
 * not own authentication, application state, API access, or router behavior.
 * All navigation is supplied as href data.
 *
 * @typedef {Object} PublicHomeFeature
 * @property {string} id
 * @property {string} number
 * @property {string} title
 * @property {string} body
 * @property {string} imageSrc
 * @property {string} imageAlt
 * @property {"image-right"|"image-left"} imageSide
 * @property {string} [imagePosition]
 *
 * @typedef {Object} PublicHomeLink
 * @property {string} label
 * @property {string} href
 *
 * @typedef {Object} PublicHomeViewProps
 * @property {string} brand
 * @property {string} brandSubtitle
 * @property {string} logoSrc
 * @property {string} eyebrow
 * @property {string} headlineLead
 * @property {string} headlineAccent
 * @property {string} introduction
 * @property {string} enterLabel
 * @property {string} enterHref
 * @property {string} learnMoreLabel
 * @property {PublicHomeFeature[]} features
 * @property {string} closingBrand
 * @property {string} closingLineOne
 * @property {string} closingLineTwo
 * @property {PublicHomeLink[]} footerLinks
 */

export {};
