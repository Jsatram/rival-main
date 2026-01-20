export function EmptyMatchState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
      <div className="text-base font-medium">No matches found</div>
      <div className="max-w-sm text-sm text-muted-foreground">
        Rival doesn’t have any indexed matches for this player yet.
      </div>
    </div>
  );
}
