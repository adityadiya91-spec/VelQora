export function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-lg border border-hairline bg-white p-8 text-center shadow-card">
      <h3 className="font-heading text-xl font-bold">{title}</h3>

      {description ? (
        <p className="mt-2 text-sm text-muted">{description}</p>
      ) : null}

      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}