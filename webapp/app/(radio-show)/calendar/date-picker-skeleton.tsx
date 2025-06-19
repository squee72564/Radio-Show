export default function DatePickerSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-5">
      <div className="flex flex-row items-center gap-4">
        <div className="h-10 w-[280px] bg-muted rounded-md animate-pulse" />
        <div className="h-10 w-24 bg-muted rounded-md animate-pulse" />
        <div className="h-10 w-24 bg-muted rounded-md animate-pulse" />
      </div>

      <div className="space-y-4 w-full overflow-auto max-h-110 p-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-4 rounded-md border bg-muted animate-pulse h-32 w-full" />
        ))}
      </div>
    </div>
  );
}
