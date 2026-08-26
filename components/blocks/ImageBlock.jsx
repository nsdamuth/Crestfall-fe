import Image from "next/image";

const defaultSizeClasses = {
  small: "max-w-xs",
  medium: "max-w-md",
  large: "max-w-2xl",
  full: "max-w-full",
};

const loreSizeClasses = {
  small: "max-w-sm",
  medium: "max-w-xl",
  large: "max-w-2xl",
  full: "max-w-3xl",
};

const alignClasses = {
  left: "mr-auto",
  center: "mx-auto",
  right: "ml-auto",
};

function isCrestfallMediaProxyUrl(value) {
  const src = typeof value === "string" ? value.trim() : "";

  return (
    /^\/api\/media\/images\/[^/]+\/file(?:\?|$)/.test(src) ||
    /^\/api\/studio\/image-generation\/outputs\/[^/]+\/file(?:\?|$)/.test(src)
  );
}

function renderImage({ src, alt, width, height, className, directMediaProxy }) {
  if (directMediaProxy) {
    // Lore image proxy URLs can carry owner-session or immutable-publication
    // authority in the browser request. Do not send them through the Next
    // image optimizer, which performs a separate server-side fetch.
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={alt ?? ""}
        width={width}
        height={height}
        className={className}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt ?? ""}
      width={width}
      height={height}
      className={className}
    />
  );
}

export default function ImageBlock({
  src,
  alt,
  caption,
  width = 1200,
  height = 700,
  size = "full",
  align = "center",
  variant = "default",
}) {
  if (!src) return null;

  const directMediaProxy = isCrestfallMediaProxyUrl(src);
  const isLoreParchment = variant === "lore-parchment";
  const sizeClasses = isLoreParchment ? loreSizeClasses : defaultSizeClasses;
  const outerSizeClass = sizeClasses[size] ?? sizeClasses.full;
  const outerAlignClass = alignClasses[align] ?? alignClasses.center;

  if (isLoreParchment) {
    return (
      <figure
        className={`lore-parchment-plate w-full space-y-3 ${outerSizeClass} ${outerAlignClass}`}
      >
        <div className="lore-parchment-plate__frame">
          <div className="lore-parchment-plate__mat">
            <div className="lore-parchment-plate__art">
              {renderImage({
                src,
                alt,
                width,
                height,
                directMediaProxy,
                className: "lore-parchment-plate__image h-auto w-full object-contain",
              })}
            </div>
          </div>
        </div>

        {caption ? (
          <figcaption className="lore-parchment-plate__caption">{caption}</figcaption>
        ) : null}
      </figure>
    );
  }

  return (
    <figure
      className={`space-y-4 ${outerSizeClass} ${outerAlignClass}`}
    >
      <div className="overflow-hidden border border-[rgba(120,85,40,0.25)] shadow-lg">
        {renderImage({
          src,
          alt,
          width,
          height,
          directMediaProxy,
          className: "h-auto w-full object-cover",
        })}
      </div>

      {caption ? (
        <figcaption className="text-center font-serif text-sm italic text-[#5a4732]">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export { isCrestfallMediaProxyUrl };
