import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteShell from "@/components/SiteShell";

export default function NotFound() {
  return (
    <>
      <SiteHeader />

      <SiteShell eyebrow="Archive Error" title="Record Not Found">
        <div className="sourcebook-page paper-clean mx-auto max-w-4xl">
          <div className="sourcebook-flourish" />

          <div className="text-center py-10">
            <p className="font-display text-xs uppercase tracking-[0.45em] text-[var(--muted-gold)]">
              Missing Archive Entry
            </p>

            <h2 className="mt-6 font-display text-5xl">
              The requested record could not be located.
            </h2>

            <p className="mx-auto mt-8 max-w-2xl font-serif text-xl italic leading-9 text-[var(--muted)]">
              The archive may be incomplete, the record may have moved, or the
              path may reference a fragment that has not yet been catalogued.
            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <Link href="/lore" className="sourcebook-button">
                Browse Lore
              </Link>

              <Link href="/characters" className="sourcebook-button">
                Characters
              </Link>

              <Link href="/" className="sourcebook-button">
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </SiteShell>
    </>
  );
}