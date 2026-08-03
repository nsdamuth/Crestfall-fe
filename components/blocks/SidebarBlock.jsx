export default function SidebarBlock({ title = "Field Note", body, items = [] }) {
  return (
    <aside className="sourcebook-sidebar">
      <h3 className="font-display text-xs uppercase tracking-[0.35em] text-[#7b5525]">
        {title}
      </h3>

      {body && (
        <p className="mt-4 font-serif text-base leading-7 text-[#2a2118]">
          {body}
        </p>
      )}

      {items.length > 0 && (
        <ul className="mt-4 space-y-2 font-serif text-base leading-7 text-[#2a2118]">
          {items.map((item, index) => (
            <li key={`${item}-${index}`}>• {item}</li>
          ))}
        </ul>
      )}
    </aside>
  );
}