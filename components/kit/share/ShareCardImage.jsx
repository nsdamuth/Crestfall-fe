// The one card renderer (fe/share-og brief 1, decisions 2A and 4A):
// art left, words right, 1200 by 630. Written in the Satori subset
// (flex only, inline styles, no CSS variables) for next/og. Every
// color, size, and radius is asked for by token name through the
// resolver the route builds from app/theme.css; nothing here names a
// value. Type sizes are the app's own scale doubled for the 1200-wide
// canvas.

const CANVAS = { width: 1200, height: 630 };
const ART_WIDTH = 540;
const SCALE = 2;

export const SHARE_CARD_THEME_NAMES = Object.freeze([
  "grad-panel-lift",
  "surface-1",
  "surface-2",
  "ink",
  "ink-dim",
  "ink-faint",
  "gold-ornament",
  "gold-action",
  "tag-fill-ink",
  "line-strong",
  "radius-md",
  "text-label",
  "text-ui",
  "text-body",
  "text-title",
  "lh-body",
  "lh-title",
  "space-4",
  "space-6",
  "space-8",
  "track-label",
]);

function toPx(value, scale = 1) {
  const text = String(value || "").trim();
  if (!text) return 0;
  if (text.endsWith("rem")) return parseFloat(text) * 16 * scale;
  if (text.endsWith("px")) return parseFloat(text) * scale;
  const number = parseFloat(text);
  return Number.isFinite(number) ? number * scale : 0;
}

function toTracking(value, fontSize) {
  const text = String(value || "").trim();
  if (text.endsWith("em")) return parseFloat(text) * fontSize;
  return toPx(text);
}

/**
 * @param {Object} props
 * @param {import("./shareCardModel.js").ShareCardModel} props.model
 * @param {(name: string) => string} props.resolve token name to value
 * @param {{ display: string, sans: string }} props.fonts family names
 * @param {string} [props.imageSrc] a data URL the route prepared, or empty
 */
export default function ShareCardImage({ model = {}, resolve = () => "", fonts = {}, imageSrc = "" }) {
  const display = fonts.display || "serif";
  const sans = fonts.sans || "sans-serif";

  const titleSize = toPx(resolve("text-title"), SCALE);
  const bodySize = toPx(resolve("text-body"), SCALE);
  const uiSize = toPx(resolve("text-ui"), SCALE);
  const labelSize = toPx(resolve("text-label"), SCALE);
  const gap4 = toPx(resolve("space-4"), SCALE);
  const gap6 = toPx(resolve("space-6"), SCALE);
  const gap8 = toPx(resolve("space-8"), SCALE);
  const pad = toPx(resolve("space-8"), SCALE);
  const radius = toPx(resolve("radius-md"), SCALE);

  return (
    <div
      style={{
        width: CANVAS.width,
        height: CANVAS.height,
        display: "flex",
        backgroundImage: resolve("grad-panel-lift"),
        color: resolve("ink"),
        fontFamily: sans,
      }}
    >
      <div
        style={{
          width: ART_WIDTH,
          height: CANVAS.height,
          display: "flex",
          position: "relative",
          backgroundColor: resolve("surface-1"),
          overflow: "hidden",
        }}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt=""
            width={ART_WIDTH}
            height={CANVAS.height}
            style={{ width: ART_WIDTH, height: CANVAS.height, objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: ART_WIDTH,
              height: CANVAS.height,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: resolve("surface-2"),
              color: resolve("ink-faint"),
              fontFamily: display,
              fontSize: titleSize,
              fontWeight: 600,
            }}
          >
            Crestfall
          </div>
        )}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 2,
            height: CANVAS.height,
            backgroundColor: resolve("gold-ornament"),
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: CANVAS.width - ART_WIDTH,
          height: CANVAS.height,
          padding: `${pad}px ${pad}px`,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
          <div
            style={{
              fontSize: labelSize,
              fontWeight: 500,
              letterSpacing: toTracking(resolve("track-label"), labelSize),
              textTransform: "uppercase",
              color: resolve("gold-ornament"),
            }}
          >
            Crestfall
          </div>
          <div
            style={{
              marginTop: gap6,
              fontFamily: display,
              fontWeight: 600,
              fontSize: titleSize,
              lineHeight: 1.1,
              color: resolve("ink"),
              lineClamp: 2,
              display: "block",
              width: "100%",
            }}
          >
            {model.title || "Untitled"}
          </div>
          {model.byline ? (
            <div style={{ marginTop: gap4, fontSize: uiSize, color: resolve("ink-dim") }}>{model.byline}</div>
          ) : null}
          {model.excerpt ? (
            <div
              style={{
                marginTop: gap8,
                fontSize: bodySize,
                lineHeight: 1.4,
                color: resolve("ink"),
                lineClamp: 3,
                display: "block",
                width: "100%",
              }}
            >
              {model.excerpt}
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: resolve("gold-action"),
              color: resolve("tag-fill-ink"),
              fontSize: uiSize,
              fontWeight: 500,
              padding: `${gap4}px ${gap8}px`,
              borderRadius: radius,
            }}
          >
            {model.invitation || ""}
          </div>
        </div>
      </div>
    </div>
  );
}
