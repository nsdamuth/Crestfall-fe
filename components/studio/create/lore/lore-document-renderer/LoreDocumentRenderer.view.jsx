"use client";

import { AlertTriangle, ArrowUp, BookOpenText } from "lucide-react";
import LoreBlockRenderer from "@/components/LoreBlockRenderer";

const CONTENTS_ANCHOR_ID = "lore-contents";

function buildAnchorHref(publicHref, anchorId) {
  if (!publicHref || !anchorId) return "";
  return `${publicHref}#${encodeURIComponent(anchorId)}`;
}

function AnchorShareButton({
  publicHref = "",
  anchorId = "",
  label = "Copy link",
  ShareButtonComponent = null,
}) {
  const href = buildAnchorHref(publicHref, anchorId);

  if (!href || !ShareButtonComponent) return null;

  return (
    <ShareButtonComponent
      href={href}
      label={label}
      copiedLabel="Link copied"
      ariaLabel={label}
      compact
    />
  );
}

function CharacterLinks({ characterRefs = [], LinkComponent }) {
  if (!characterRefs.length) return null;

  return (
    <div className="mt-6 flex flex-wrap justify-center gap-2">
      {characterRefs.map((character) => (
        <LinkComponent
          key={character.id}
          href={`/studio/creations/${encodeURIComponent(character.id)}`}
          className="rounded-full border border-[#7b5525]/30 bg-[#7b5525]/5 px-3 py-1 font-display text-[10px] uppercase tracking-[0.18em] text-[#6a481f] transition hover:bg-[#7b5525]/10"
        >
          {character.title || "Character"}
        </LinkComponent>
      ))}
    </div>
  );
}

function LocationLinks({ locationRefs = [], LinkComponent }) {
  if (!locationRefs.length) return null;

  return (
    <div className="mt-3 flex flex-wrap justify-center gap-2">
      {locationRefs.map((location) => (
        <LinkComponent
          key={location.id}
          href={`/studio/creations/${encodeURIComponent(location.id)}`}
          className="rounded-full border border-[#44604b]/35 bg-[#44604b]/10 px-3 py-1 font-display text-[10px] uppercase tracking-[0.18em] text-[#36513e] transition hover:bg-[#44604b]/15"
        >
          {location.title || "Location"}
        </LinkComponent>
      ))}
    </div>
  );
}

function SectionHeader({
  section,
  sectionIndex,
  publicHref = "",
  LinkComponent,
  ShareButtonComponent,
}) {
  const hasHeader = Boolean(
    section.title ||
      section.subtitle ||
      section.eyebrow ||
      section.displayDate ||
      section.era ||
      section.summary ||
      section.characterRefs?.length ||
      section.locationRefs?.length
  );

  if (!hasHeader) return null;

  return (
    <header className="text-center">
      <p className="sourcebook-eyebrow font-display text-xs uppercase tracking-[0.3em]">
        {section.eyebrow || `Section ${sectionIndex + 1}`}
      </p>
      {section.title ? (
        <h2 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
          {section.title}
        </h2>
      ) : null}
      {section.subtitle ? (
        <p className="mx-auto mt-4 max-w-3xl font-serif text-lg italic leading-8 text-[#5a4732]">
          {section.subtitle}
        </p>
      ) : null}
      {section.displayDate || section.era ? (
        <p className="mt-4 font-display text-[10px] uppercase tracking-[0.25em] text-[#7b5525]">
          {[section.displayDate, section.era].filter(Boolean).join(" · ")}
        </p>
      ) : null}
      {section.title ? (
        <div className="mt-5 flex justify-center">
          <AnchorShareButton
            publicHref={publicHref}
            anchorId={section.id}
            label="Copy section link"
            ShareButtonComponent={ShareButtonComponent}
          />
        </div>
      ) : null}
      <CharacterLinks
        characterRefs={section.characterRefs || []}
        LinkComponent={LinkComponent}
      />
      <LocationLinks
        locationRefs={section.locationRefs || []}
        LinkComponent={LinkComponent}
      />
      {section.summary ? (
        <div className="sourcebook-callout mt-8 text-left">
          <h3>Section Summary</h3>
          <p className="mt-3">{section.summary}</p>
        </div>
      ) : null}
    </header>
  );
}

export default function LoreDocumentRendererView({
  document,
  title = "",
  description = "",
  creator = null,
  showTestBanner = false,
  testBannerText = "",
  compact = false,
  publicHref = "",
  LinkComponent = "a",
  ShareButtonComponent = null,
}) {
  const chapters = Array.isArray(document?.chapters) ? document.chapters : [];
  const titledSectionCount = chapters.reduce(
    (total, chapter) =>
      total + chapter.sections.filter((section) => section.title).length,
    0
  );
  const showContents = !compact && (chapters.length > 1 || titledSectionCount > 1);

  return (
    <div className={compact ? "space-y-5" : "space-y-8"}>
      {showTestBanner ? (
        <div className="mx-auto flex max-w-5xl items-start gap-3 rounded-xl border border-amber-300/25 bg-amber-300/10 px-4 py-3 text-sm leading-6 text-amber-100">
          <AlertTriangle size={17} className="mt-1 shrink-0" />
          <p>
            {testBannerText ||
              "Development preview of the current Lore draft. Public readers receive only an immutable saved revision that has passed security validation and been explicitly published. Character-use access remains a separate workflow."}
          </p>
        </div>
      ) : null}

      <article className="sourcebook-page mx-auto max-w-5xl">
        <header className="text-center">
          <p className="sourcebook-eyebrow font-display text-xs uppercase tracking-[0.35em]">
            {document.eyebrow || "Lore Archive"}
          </p>
          <h1 className="mt-5 font-display text-5xl leading-tight sm:text-7xl">
            {title || "Untitled Lore Asset"}
          </h1>
          {document.subtitle ? (
            <p className="mx-auto mt-5 max-w-3xl font-serif text-xl italic leading-8 text-[#5a4732]">
              {document.subtitle}
            </p>
          ) : null}
          {document.displayDate || document.era || document.realm ? (
            <p className="mt-5 font-display text-[10px] uppercase tracking-[0.28em] text-[#7b5525]">
              {[document.displayDate, document.era, document.realm]
                .filter(Boolean)
                .join(" · ")}
            </p>
          ) : null}
          {description ? (
            <p className="mx-auto mt-7 max-w-3xl font-serif text-lg leading-8 text-[#3b3024]">
              {description}
            </p>
          ) : null}
          {creator?.displayName ? (
            <p className="mt-5 font-display text-[10px] uppercase tracking-[0.24em] text-[#7b5525]">
              By {creator.displayName}
            </p>
          ) : null}
          <CharacterLinks
            characterRefs={document.characterRefs || []}
            LinkComponent={LinkComponent}
          />
          <LocationLinks
            locationRefs={document.locationRefs || []}
            LinkComponent={LinkComponent}
          />
        </header>

        {document.summary ? (
          <div className="sourcebook-callout mt-10">
            <h3>Archive Summary</h3>
            <p className="mt-3">{document.summary}</p>
          </div>
        ) : null}
      </article>

      {showContents ? (
        <nav
          id={CONTENTS_ANCHOR_ID}
          className="mx-auto max-w-5xl scroll-mt-24 rounded-[var(--radius-md)] border border-[var(--muted-gold)]/20 bg-black/45 p-5"
        >
          <div className="flex items-center gap-2 text-[var(--muted-gold)]">
            <BookOpenText size={17} />
            <p className="text-xs uppercase tracking-[0.2em]">Contents</p>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {chapters.map((chapter, chapterIndex) => (
              <div
                key={chapter.id}
                className="rounded-lg border border-white/10 bg-black/25 p-3"
              >
                <a
                  href={`#${chapter.id}`}
                  className="text-sm text-[var(--foreground)] transition hover:text-[var(--muted-gold)]"
                >
                  {chapterIndex + 1}. {chapter.title || "Untitled Chapter"}
                </a>
                {chapter.sections.some((section) => section.title) ? (
                  <div className="mt-2 grid gap-1 border-l border-white/10 pl-3">
                    {chapter.sections.map((section, sectionIndex) =>
                      section.title ? (
                        <a
                          key={section.id}
                          href={`#${section.id}`}
                          className="text-xs leading-5 text-[var(--muted)] transition hover:text-[var(--foreground)]"
                        >
                          {chapterIndex + 1}.{sectionIndex + 1} {section.title}
                        </a>
                      ) : null
                    )}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </nav>
      ) : null}

      {chapters.map((chapter, chapterIndex) => (
        <article
          id={chapter.id}
          key={chapter.id}
          className="sourcebook-page mx-auto max-w-5xl scroll-mt-24"
        >
          <header className="text-center">
            <p className="sourcebook-eyebrow font-display text-xs uppercase tracking-[0.35em]">
              {chapter.eyebrow || document.eyebrow || `Chapter ${chapterIndex + 1}`}
            </p>
            <h1 className="mt-5 font-display text-5xl leading-tight sm:text-6xl">
              {chapter.title || "Untitled Chapter"}
            </h1>
            {chapter.subtitle ? (
              <p className="mx-auto mt-5 max-w-3xl font-serif text-xl italic leading-8 text-[#5a4732]">
                {chapter.subtitle}
              </p>
            ) : null}
            {chapter.displayDate || chapter.era ? (
              <p className="mt-5 font-display text-[10px] uppercase tracking-[0.28em] text-[#7b5525]">
                {[chapter.displayDate, chapter.era].filter(Boolean).join(" · ")}
              </p>
            ) : null}
            <div className="mt-5 flex justify-center">
              <AnchorShareButton
                publicHref={publicHref}
                anchorId={chapter.id}
                label="Copy chapter link"
                ShareButtonComponent={ShareButtonComponent}
              />
            </div>
            <CharacterLinks
              characterRefs={chapter.characterRefs || []}
              LinkComponent={LinkComponent}
            />
            <LocationLinks
              locationRefs={chapter.locationRefs || []}
              LinkComponent={LinkComponent}
            />
          </header>

          {chapter.summary ? (
            <div className="sourcebook-callout mt-10">
              <h3>Chapter Summary</h3>
              <p className="mt-3">{chapter.summary}</p>
            </div>
          ) : null}

          {chapter.sections.map((section, sectionIndex) => (
            <section
              id={section.id}
              key={section.id}
              className={`scroll-mt-24 ${
                sectionIndex === 0
                  ? "mt-12"
                  : "mt-14 border-t border-[#7b5525]/20 pt-14"
              }`}
            >
              <SectionHeader
                section={section}
                sectionIndex={sectionIndex}
                publicHref={publicHref}
                LinkComponent={LinkComponent}
                ShareButtonComponent={ShareButtonComponent}
              />
              <LoreBlockRenderer blocks={section.blocks || []} />
            </section>
          ))}

          {!chapter.sections.length ? (
            <div className="mt-10 rounded-xl border border-dashed border-[#7b5525]/30 p-6 text-center font-serif text-sm text-[#5a4732]">
              This chapter has no sections yet.
            </div>
          ) : null}

          {showContents ? (
            <div className="mt-12 flex justify-center border-t border-[#7b5525]/20 pt-8">
              <a
                href={`#${CONTENTS_ANCHOR_ID}`}
                className="inline-flex items-center gap-2 font-display text-[10px] uppercase tracking-[0.2em] text-[#6a481f] transition hover:text-[#3b3024]"
              >
                <ArrowUp size={13} />
                Back to contents
              </a>
            </div>
          ) : null}
        </article>
      ))}

      {!chapters.length ? (
        <div className="mx-auto max-w-5xl rounded-[var(--radius-md)] border border-dashed border-[var(--muted-gold)]/30 bg-black/30 p-10 text-center text-sm text-[var(--muted)]">
          Add a chapter to begin the Lore publication.
        </div>
      ) : null}
    </div>
  );
}
