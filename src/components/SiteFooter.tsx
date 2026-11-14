export function SiteFooter({ title, note, meta }: { title: string; note: string; meta: string[] }) {
  return (
    <footer className="ke-foot">
      <div>
        <span className="foot-title">{title}</span>
        <span>　{note}</span>
      </div>
      <div className="foot-meta">
        {meta.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </footer>
  );
}
