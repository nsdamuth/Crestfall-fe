import { ArrowLeft } from "lucide-react";

export default function StudioBackLinkView({
  href = "/studio",
  label = "Back",
  className = "",
  LinkComponent = "a",
}) {
  return (
    <LinkComponent
      href={href}
      className={`inline-flex w-fit items-center gap-2 rounded-full border border-[var(--muted-gold)]/25 bg-black/20 px-4 py-2 text-xs uppercase tracking-[0.18em] text-[var(--muted)] transition hover:border-[var(--muted-gold)]/60 hover:bg-[var(--muted-gold)]/10 hover:text-[var(--foreground)] ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </LinkComponent>
  );
}
