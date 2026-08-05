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
      className={`inline-flex w-fit items-center gap-2 rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/25 bg-black/20 px-4 py-2 text-xs uppercase tracking-[0.18em] text-[var(--ink-dim)] transition hover:border-[var(--gold-ornament)]/60 hover:bg-[var(--gold-ornament)]/10 hover:text-[var(--ink)] ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </LinkComponent>
  );
}
