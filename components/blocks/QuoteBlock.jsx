export default function QuoteBlock({ text, attribution }) {
  if (!text) return null;

  return (
    <blockquote className="sourcebook-quote">
      <p className="font-serif text-2xl italic leading-10 text-center text-[#2a2118]">
        “{text}”
      </p>

      {attribution && (
        <footer className="mt-4 text-center font-display text-xs uppercase tracking-[0.35em] text-[#7b5525]">
          {attribution}
        </footer>
      )}
    </blockquote>
  );
}