export default function ExcerptBlock({ title, body }) {
  return (
    <section className="border border-[rgba(120,85,40,0.28)] bg-[rgba(255,255,255,0.28)] p-6 shadow-sm">
      {title && (
        <h3 className="font-display text-sm uppercase tracking-[0.35em] text-[#7b5525]">
          {title}
        </h3>
      )}

      <p className="mt-5 font-serif text-lg italic leading-8 text-[#2a2118]">
        {body}
      </p>
    </section>
  );
}