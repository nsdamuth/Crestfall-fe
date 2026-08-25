import SiteFooter from "@/components/SiteFooter";
import InsertedStory from "@/components/InsertedStory";
import LoreCard from "@/components/LoreCard";
import SiteHeader from "@/components/SiteHeader";
import { featuredSections } from "@/data/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const heroImages = [
  "/assets/covers/crestfall-camellia-cover.png",
  "/assets/covers/crestfall-compass-cover.png",
];

const heroTitles = [
  "Where stories leave fingerprints",
  "Some doors should have remained closed",
  "Every legend began as a witness statement",
  "Not every world stays where it belongs",
  "The old stories are still watching",
  "Cross the threshhold carefully",
];
const HOME_HERO_IMAGE_INDEX = 0;
const HOME_HERO_TITLE_INDEX = 0;
export default function Home() {
  const heroImage = heroImages[HOME_HERO_IMAGE_INDEX % heroImages.length];
  const heroTitle = heroTitles[HOME_HERO_TITLE_INDEX % heroTitles.length];
  return (
    <main className="relative min-h-screen overflow-hidden text-[var(--foreground)]">
      <div
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundPosition: "center 0%",
        }}
      />

      <div className="absolute inset-0 bg-[rgba(5,5,4,0.42)]" />

      <div className="relative z-10">
        <section className="relative isolate min-h-[50vh] overflow-hidden border-b border-[var(--line-strong)]">
          <div className="hero-overlay absolute inset-0" />

          <SiteHeader home />

          <div className="relative z-20 mx-auto flex max-w-7xl flex-col justify-center px-6 pb-24 pt-20 sm:px-10 lg:px-16">
            <p className="font-display text-sm uppercase tracking-[0.5em] text-[var(--muted-gold)]">
              Lore Archive
            </p>

            <h2 className="mt-6 max-w-5xl font-display text-6xl leading-none tracking-tight sm:text-7xl lg:text-8xl">
              {heroTitle}
            </h2>

            <p className="mt-8 max-w-3xl font-serif text-2xl leading-10 text-[var(--muted)]">
              A living dark fantasy archive of characters, locations, factions,
              myths, histories, and the unfolding Chronicle of Crestfall.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link className="sourcebook-button" href="/lore">
                Enter the Archive
              </Link>

              <Link className="sourcebook-button secondary" href="/chronicle">
                Read the Chronicle
              </Link>
              <a className="sourcebook-button" href="/studio">
                Enter Crestfall
              </a>
            </div>
          </div>
        </section>

        <section
          id="archive"
          className="px-6 py-20 sm:px-10 lg:px-16"
          style={{
            background:
              "linear-gradient(to bottom, rgba(5,5,4,0.46), rgba(5,5,4,0.82))",
            backdropFilter: "blur(2px)",
          }}
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 border-b border-[var(--line-strong)] pb-5">
              <p className="font-display text-xs uppercase tracking-[0.4em] text-[var(--muted-gold)]">
                Archive Index
              </p>

              <h2 className="mt-3 font-display text-4xl">
                Explore the records.
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {featuredSections.map((section) => (
                <LoreCard
                  key={section.title}
                  eyebrow={section.eyebrow}
                  title={section.title}
                  text={section.text}
                  href={section.slug}
                />
              ))}
            </div>
          </div>
        </section>

        <section
          className="px-6 pb-24 sm:px-10 lg:px-16"
          style={{
            background: "rgba(5,5,4,0.82)",
            backdropFilter: "blur(2px)",
          }}
        >
          <div className="mx-auto max-w-7xl">
            <InsertedStory title="Not every story agrees.">
              <p>
                Some records were written by scholars. Some by liars. Some by
                witnesses who survived something they could not explain.
              </p>
            </InsertedStory>
          </div>
          <br />
          <SiteFooter />
        </section>
      </div>
    </main>
  );
}