
export default function CreateTypeCardView({
  title = "",
  description = "",
  href = "",
  image = "",
  eyebrow = "",
  disabled = false,
  LinkComponent = "a",
}) {
  const content = (
    <article className="group relative min-h-[220px] overflow-hidden rounded-2xl border border-[var(--muted-gold)]/25 bg-black/50 p-6 transition hover:-translate-y-1 hover:border-[var(--muted-gold)]/60">
      {image ? (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 grayscale transition duration-500 group-hover:opacity-55 group-hover:grayscale-0"
          style={{ backgroundImage: `url(${image})` }}
        />
      ) : null}

      <div className="absolute inset-0 bg-gradient-to-br from-black via-black/80 to-black/35" />

      <div className="relative z-10 flex h-full flex-col justify-between">
        <div>
          {eyebrow ? (
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted-gold)]">
              {eyebrow}
            </p>
          ) : null}

          <h2 className="mt-4 font-display text-3xl text-[var(--foreground)]">
            {title}
          </h2>

          <p className="mt-4 leading-7 text-[var(--muted)]">{description}</p>
        </div>

        <p className="mt-8 text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
          {disabled ? "Coming Soon" : "Begin Creation →"}
        </p>
      </div>
    </article>
  );

  if (disabled) {
    return <div className="cursor-not-allowed opacity-60">{content}</div>;
  }

  return <LinkComponent href={href}>{content}</LinkComponent>;
}
