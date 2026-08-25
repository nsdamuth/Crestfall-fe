import Link from "next/link";
import Image from "next/image";

export default function LoreCard({
  eyebrow,
  title,
  text,
  href,
  image,
  imageAlt,
}) {
  return (
    <Link
      href={href}
      className="group block border border-[var(--line-strong)] bg-[rgba(12,10,8,0.82)] p-6 transition hover:border-[var(--muted-gold)]"
    >
      {image && (
        <div className="-mx-6 -mt-6 mb-5 aspect-[4/3] overflow-hidden border-b border-[var(--line-strong)]">
          <Image
            src={image}
            alt={imageAlt ?? title}
            width={900}
            height={675}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        </div>
      )}

      <p className="text-xs uppercase tracking-[0.32em] text-[var(--muted-gold)]">
        {eyebrow}
      </p>

      <h3 className="mt-4 font-display text-2xl">{title}</h3>

      <p className="mt-4 font-serif text-lg leading-7 text-[var(--muted)]">
        {text}
      </p>
    </Link>
  );
}