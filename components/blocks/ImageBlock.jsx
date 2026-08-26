import Image from "next/image";

const sizeClasses = {
  small: "max-w-xs",
  medium: "max-w-md",
  large: "max-w-2xl",
  full: "max-w-full",
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

export default function ImageBlock({
  src,
  alt,
  caption,
  width = 1200,
  height = 700,
  size = "full",
  align = "center",
}) {
  if (!src) return null;

  const directMediaProxy = isCrestfallMediaProxyUrl(src);
  const imageClassName = "h-auto w-full object-cover";

  return (
    <figure
      className={`space-y-4 ${sizeClasses[size] ?? sizeClasses.full} ${
        alignClasses[align] ?? alignClasses.center
      }`}
    >
      <div className="overflow-hidden border border-[rgba(120,85,40,0.25)] shadow-lg">
        {directMediaProxy ? (
          // Lore image proxy URLs can carry owner-session or immutable-publication
          // authority in the browser request. Do not send them through the Next
          // image optimizer, which performs a separate server-side fetch.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt ?? ""}
            width={width}
            height={height}
            className={imageClassName}
          />
        ) : (
          <Image
            src={src}
            alt={alt ?? ""}
            width={width}
            height={height}
            className={imageClassName}
          />
        )}
      </div>

      {caption && (
        <figcaption className="text-center font-serif text-sm italic text-[#5a4732]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export { isCrestfallMediaProxyUrl };
