export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <div className="rounded-xl border p-5 space-y-3">
        <div className="h-4 w-24 bg-muted rounded" />
        <div className="h-6 w-2/3 bg-muted rounded" />
        <div className="h-4 w-1/2 bg-muted rounded" />
      </div>
      <div className="grid gap-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-xl border p-5">
            <div className="h-5 w-32 bg-muted rounded" />
            <div className="h-4 w-2/3 bg-muted rounded mt-3" />
          </div>
        ))}
      </div>
    </div>
  );
}
