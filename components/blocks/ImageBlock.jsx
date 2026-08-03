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

  return (
    <figure
      className={`space-y-4 ${sizeClasses[size] ?? sizeClasses.full} ${
        alignClasses[align] ?? alignClasses.center
      }`}
    >
      <div className="overflow-hidden border border-[rgba(120,85,40,0.25)] shadow-lg">
        <Image
          src={src}
          alt={alt ?? ""}
          width={width}
          height={height}
          className="h-auto w-full object-cover"
        />
      </div>

      {caption && (
        <figcaption className="text-center font-serif text-sm italic text-[#5a4732]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}