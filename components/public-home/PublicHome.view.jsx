function FlowerLineArt() {
  const petals = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 720 720"
      className="h-full w-full"
      fill="none"
    >
      <circle cx="360" cy="360" r="286" stroke="currentColor" strokeOpacity="0.16" />
      <circle
        cx="360"
        cy="360"
        r="224"
        stroke="currentColor"
        strokeOpacity="0.08"
        strokeDasharray="2 12"
      />

      <g stroke="currentColor" strokeWidth="1.25" strokeOpacity="0.28">
        {petals.map((rotation) => (
          <g key={rotation} transform={`rotate(${rotation} 360 360)`}>
            <path d="M360 354C304 310 294 218 360 126C426 218 416 310 360 354Z" />
            <path d="M360 350C326 311 327 248 360 184C393 248 394 311 360 350Z" />
          </g>
        ))}
      </g>

      <g stroke="currentColor" strokeWidth="1" strokeOpacity="0.2">
        <path d="M360 380C310 430 254 478 174 516" />
        <path d="M360 380C410 430 466 478 546 516" />
        <path d="M225 489C190 450 143 448 112 468C148 507 188 513 225 489Z" />
        <path d="M495 489C530 450 577 448 608 468C572 507 532 513 495 489Z" />
        <path d="M270 445C226 418 185 426 162 456C206 477 242 470 270 445Z" />
        <path d="M450 445C494 418 535 426 558 456C514 477 478 470 450 445Z" />
      </g>

      <g fill="currentColor" fillOpacity="0.22">
        <circle cx="360" cy="360" r="7" />
        <circle cx="360" cy="336" r="3" />
        <circle cx="384" cy="360" r="3" />
        <circle cx="360" cy="384" r="3" />
        <circle cx="336" cy="360" r="3" />
      </g>
    </svg>
  );
}

function FeatureMark({ index }) {
  if (index === 1) {
    return (
      <svg aria-hidden="true" viewBox="0 0 32 32" className="h-7 w-7" fill="none">
        <path d="M16 3v26M3 16h26M7 7l18 18M25 7 7 25" stroke="currentColor" strokeWidth="1" />
        <circle cx="16" cy="16" r="5" stroke="currentColor" strokeWidth="1" />
      </svg>
    );
  }

  if (index === 2) {
    return (
      <svg aria-hidden="true" viewBox="0 0 32 32" className="h-7 w-7" fill="none">
        <path d="M6 25 16 5l10 20-10-5-10 5Z" stroke="currentColor" strokeWidth="1.1" />
        <path d="M16 5v15" stroke="currentColor" strokeWidth="1" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" className="h-7 w-7" fill="none">
      <path
        d="M7 25c7-2 13-8 18-18-8 3-14 8-18 18Zm0 0 13-13M12 20l-4-2M16 16l-3-4"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FeatureArtwork({ feature, imageFirst, mobile = false }) {
  const edgeFade = imageFirst
    ? "bg-[linear-gradient(to_right,transparent_0%,transparent_45%,rgba(9,8,5,0.16)_60%,rgba(9,8,5,0.72)_82%,rgba(9,8,5,0.98)_100%)]"
    : "bg-[linear-gradient(to_left,transparent_0%,transparent_45%,rgba(9,8,5,0.16)_60%,rgba(9,8,5,0.72)_82%,rgba(9,8,5,0.98)_100%)]";

  return (
    <div
      className={
        mobile
          ? "relative min-h-[280px] overflow-hidden md:hidden"
          : `absolute inset-y-0 hidden w-[60%] overflow-hidden md:block ${
              imageFirst ? "left-0" : "right-0"
            }`
      }
    >
      <img
        src={feature.imageSrc}
        alt={feature.imageAlt}
        className="absolute inset-0 h-full w-full scale-[1.01] object-cover"
        style={{ objectPosition: feature.imagePosition || "50% 50%" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,6,5,0.04),transparent_44%,rgba(6,6,5,0.22)_100%)]" />
      {mobile ? (
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_38%,rgba(9,8,5,0.14)_58%,rgba(9,8,5,0.96)_100%)]" />
      ) : (
        <div className={`absolute inset-0 ${edgeFade}`} />
      )}
    </div>
  );
}

function FeaturePanel({ feature, index }) {
  const imageFirst = feature.imageSide === "image-left";

  return (
    <article className="relative isolate overflow-hidden rounded-[var(--radius-md)] border border-[var(--line)] bg-[rgba(9,8,6,0.96)] shadow-[0_18px_58px_rgba(0,0,0,0.18)]">
      <FeatureArtwork feature={feature} imageFirst={imageFirst} />
      <FeatureArtwork feature={feature} imageFirst={imageFirst} mobile />

      <div
        className={`relative z-10 flex min-h-[300px] items-center px-7 pb-11 pt-5 sm:px-10 md:min-h-[370px] md:w-[52%] md:px-12 md:py-12 lg:px-14 ${
          imageFirst ? "md:ml-auto" : ""
        }`}
      >
        <div className="max-w-xl">
          <div className="mb-5 flex items-center gap-4 text-[var(--gold-ornament)]">
            <FeatureMark index={index} />
            <span className="font-display text-xs tracking-[0.3em]">{feature.number}</span>
            <span className="h-px w-12 bg-[var(--line-strong)]" />
          </div>
          <h2 className="font-display text-3xl leading-tight text-[var(--ink)] sm:text-4xl lg:text-5xl">
            {feature.title}
          </h2>
          <p className="mt-5 max-w-lg font-serif text-lg leading-8 text-[var(--ink-dim)] sm:text-xl">
            {feature.body}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function PublicHomeView({
  brand,
  brandSubtitle,
  logoSrc,
  eyebrow,
  headlineLead,
  headlineAccent,
  introduction,
  enterLabel,
  enterHref,
  learnMoreLabel,
  features,
  closingBrand,
  closingLineOne,
  closingLineTwo,
  footerLinks,
}) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--canvas)] text-[var(--ink)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(201,168,106,0.06),transparent_30%),radial-gradient(circle_at_50%_78%,rgba(224,171,94,0.025),transparent_30%)]"
      />

      <header className="relative z-20 flex items-center px-6 py-7 sm:px-10 lg:px-14">
        <a href="/" className="inline-flex items-center gap-4 transition-opacity hover:opacity-90">
          <img src={logoSrc} alt="" className="h-12 w-12 object-contain sm:h-14 sm:w-14" />
          <div className="font-display leading-none">
            <div className="text-lg tracking-[0.08em] text-[var(--ink)] sm:text-xl">{brand}</div>
            <div className="mt-2 text-[10px] uppercase tracking-[0.36em] text-[var(--gold-ornament)]">
              {brandSubtitle}
            </div>
          </div>
        </a>
      </header>

      <section className="relative isolate flex min-h-[760px] items-center justify-center px-6 pb-20 pt-8 sm:min-h-[820px] sm:px-10 lg:min-h-[860px]">
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 h-[720px] w-[720px] max-w-[96vw] -translate-x-1/2 -translate-y-[48%] text-[var(--gold-ornament)] sm:h-[820px] sm:w-[820px] lg:h-[920px] lg:w-[920px]"
        >
          <FlowerLineArt />
        </div>

        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center text-center">
          <div className="flex items-center gap-4 text-[var(--gold-ornament)]">
            <span className="hidden h-px w-16 bg-[var(--line-strong)] sm:block" />
            <p className="font-display text-[11px] uppercase tracking-[0.42em] sm:text-xs">
              {eyebrow}
            </p>
            <span className="hidden h-px w-16 bg-[var(--line-strong)] sm:block" />
          </div>

          <h1 className="mt-8 font-display text-6xl leading-[0.9] tracking-[-0.02em] text-[var(--ink)] sm:text-7xl md:text-8xl lg:text-[7.25rem]">
            <span className="block">{headlineLead}</span>
            <span className="mt-2 block font-normal italic text-[var(--gold-ornament)]">
              {headlineAccent}
            </span>
          </h1>

          <p className="mt-8 max-w-3xl font-serif text-lg leading-8 text-[var(--ink-dim)] sm:text-xl sm:leading-9">
            {introduction}
          </p>

          <a
            href={enterHref}
            className="mt-10 inline-flex min-h-12 items-center justify-center border border-[var(--gold-action)] bg-[rgba(224,171,94,0.06)] px-8 py-3 font-display text-xs uppercase tracking-[0.3em] text-[var(--gold-bright)] transition hover:border-[var(--gold-bright)] hover:bg-[rgba(224,171,94,0.11)] focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
          >
            {enterLabel}
          </a>

          <a
            href="#why-crestfall"
            className="mt-8 flex flex-col items-center gap-2 font-display text-xs text-[var(--ink-faint)] transition hover:text-[var(--gold-ornament)]"
          >
            <span>{learnMoreLabel}</span>
            <span aria-hidden="true" className="text-lg leading-none">⌄</span>
          </a>
        </div>
      </section>

      <section id="why-crestfall" className="relative z-10 border-t border-[var(--line)] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-10 flex items-center justify-center gap-5 sm:mb-14">
            <span className="h-px w-20 bg-[var(--line)] sm:w-28" />
            <p className="font-display text-[10px] uppercase tracking-[0.38em] text-[var(--gold-ornament)] sm:text-xs">
              A sanctuary for storytellers
            </p>
            <span className="h-px w-20 bg-[var(--line)] sm:w-28" />
          </div>

          <div className="space-y-5 sm:space-y-7">
            {features.map((feature, index) => (
              <FeaturePanel key={feature.id} feature={feature} index={index + 1} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 py-20 text-center sm:px-10 sm:py-24">
        <div className="mx-auto max-w-4xl border-y border-[var(--line)] py-14 sm:py-16">
          <p className="font-display text-3xl leading-tight text-[var(--gold-ornament)] sm:text-4xl md:text-5xl">
            {closingLineOne}
            <br />
            {closingLineTwo}
          </p>
          <div className="mx-auto mt-8 flex items-center justify-center gap-4">
            <span className="h-px w-16 bg-[var(--line)]" />
            <span className="font-display text-[10px] uppercase tracking-[0.42em] text-[var(--ink-faint)] sm:text-xs">
              {closingBrand}
            </span>
            <span className="h-px w-16 bg-[var(--line)]" />
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-[var(--line)] px-6 py-10 sm:px-10 lg:px-14">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-7 text-center md:flex-row md:text-left">
          <div>
            <p className="font-display text-xs uppercase tracking-[0.34em] text-[var(--gold-ornament)]">
              {closingBrand}
            </p>
            <p className="mt-2 font-serif text-sm text-[var(--ink-faint)]">
              A worldbuilding and storytelling studio for persistent interactive fiction.
            </p>
          </div>

          <nav
            aria-label="Legal and support"
            className="flex flex-wrap justify-center gap-x-7 gap-y-3 font-display text-[10px] uppercase tracking-[0.2em] text-[var(--ink-faint)] sm:text-xs md:justify-end"
          >
            {footerLinks.map((link) => (
              <a key={link.href} href={link.href} className="transition hover:text-[var(--gold-ornament)]">
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </main>
  );
}
