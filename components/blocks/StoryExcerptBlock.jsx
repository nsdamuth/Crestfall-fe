import Image from "next/image";

const imageSizeClasses = {
  small: "max-w-xs",
  medium: "max-w-md",
  large: "max-w-2xl",
  full: "max-w-full",
};

export default function StoryExcerptBlock({
  title = "Recovered Fragment",
  subtitle,
  body,
  attribution,
  image,
  imageAlt,
  imageCaption,
  imagePosition = "top",
  imageSize = "full",
}) {
  const imageMarkup = image ? (
    <figure className={`space-y-3 ${imageSizeClasses[imageSize] ?? imageSizeClasses.full}`}>
      <div className="overflow-hidden border border-[rgba(120,85,40,0.25)] shadow-md">
        <Image
          src={image}
          alt={imageAlt ?? ""}
          width={1200}
          height={700}
          className="h-auto w-full object-cover"
        />
      </div>

      {imageCaption && (
        <figcaption className="text-center font-serif text-sm italic text-[#5a4732]">
          {imageCaption}
        </figcaption>
      )}
    </figure>
  ) : null;

  const textMarkup = (
    <div>
      <p className="font-display text-xs uppercase tracking-[0.35em] text-[#7b5525]">
        {title}
      </p>

      {subtitle && (
        <h3 className="mt-3 font-display text-2xl text-[#17120d]">
          {subtitle}
        </h3>
      )}

      <div className="mt-5 space-y-5 font-serif text-lg italic leading-8 text-[#2a2118]">
        {body
          ?.split("\n")
          .filter(Boolean)
          .map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
      </div>

      {attribution && (
        <footer className="mt-5 font-display text-xs uppercase tracking-[0.3em] text-[#7b5525]">
          — {attribution}
        </footer>
      )}
    </div>
  );

  if (image && (imagePosition === "left" || imagePosition === "right")) {
    return (
      <section className="sourcebook-story-excerpt">
        <div className="grid gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-start">
          {imagePosition === "left" && imageMarkup}
          {textMarkup}
          {imagePosition === "right" && imageMarkup}
        </div>
      </section>
    );
  }

  return (
    <section className="sourcebook-story-excerpt">
      {imagePosition === "top" && imageMarkup}
      <div className={imagePosition === "top" && image ? "mt-6" : ""}>
        {textMarkup}
      </div>
      {imagePosition === "bottom" && image && (
        <div className="mt-6">{imageMarkup}</div>
      )}
    </section>
  );
}