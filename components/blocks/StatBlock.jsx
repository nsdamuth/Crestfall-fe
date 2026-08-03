export default function StatBlock({ title = "Quick Reference", items = [] }) {
  return (
    <section className="sourcebook-statblock">
      <h3>{title}</h3>

      <dl>
        {items.map((item, index) => (
          <div key={item.id || `${item.label}-${index}`}>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
