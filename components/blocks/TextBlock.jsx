export default function TextBlock({
  title,
  titleStyle = "normal",
  body,
  dropCap = false,
  indent = false,
}) {
  const paragraphs = body?.split(/\n\s*\n/).filter(Boolean) ?? [];

  return (
    <section>
      {title && (
        <h3
          className={`text-sm uppercase tracking-[0.3em] text-[#7b5525] ${
            titleStyle === "bold" ? "font-bold" : ""
          }`}
        >
          {title}
        </h3>
      )}

      <div className="mt-5 space-y-5 font-serif text-lg leading-8 text-[#2a2118]">
        {paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className={`${indent ? "indent-8" : ""} ${
              dropCap && index === 0
                ? "first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:italic first-letter:leading-[0.85] first-letter:text-[#7b5525]"
                : ""
            }`}
          >
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}