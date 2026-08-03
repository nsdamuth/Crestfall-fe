import ScrollControls from "@/components/ScrollControls";
import Link from "next/link";

export default function SiteShell({ eyebrow, title, children }) {
  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-20 text-[var(--foreground)] sm:px-10 lg:px-16">
      <div
        className="absolute inset-0 bg-cover bg-top bg-no-repeat opacity-30"
        style={{
          backgroundImage: "url('/assets/covers/crestfall-camellia-cover.png')",
        }}
      />

      <div className="absolute inset-0 bg-[rgba(5,5,4,0.78)]" />

      <div className="relative z-10 mx-auto max-w-5xl">
        {eyebrow && (
          <p className="font-display text-xs uppercase tracking-[0.4em] text-[var(--muted-gold)]">
            {eyebrow}
          </p>
        )}

        <h1 className="mt-4 font-display text-5xl">{title}</h1>

        <div className="mt-6">{children}</div>

        <Link className="sourcebook-button mt-10" href="/">
          Return Home
        </Link>
      </div>
      <ScrollControls />
    </main>
  );
}