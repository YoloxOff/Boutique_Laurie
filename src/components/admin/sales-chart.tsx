export function SalesChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div className="flex h-40 items-end gap-1">
      {data.map((d) => (
        <div key={d.label} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
          <div
            className="w-full rounded-t bg-primary/80"
            style={{ height: `${Math.max(2, (d.value / max) * 100)}%` }}
            title={`${d.label} : ${d.value.toFixed(2)} €`}
          />
          <span className="text-[10px] text-muted-foreground">{d.label}</span>
        </div>
      ))}
    </div>
  );
}
