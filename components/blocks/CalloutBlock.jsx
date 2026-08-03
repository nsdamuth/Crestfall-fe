export default function CalloutBlock({ title = "Note", body }) {
  const paragraphs = body?.split(/\n\s*\n/).filter(Boolean) ?? [];

  return (
    <aside className="sourcebook-callout">
      <h3>{title}</h3>

      <div className="mt-3 space-y-4">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </aside>
  );
}