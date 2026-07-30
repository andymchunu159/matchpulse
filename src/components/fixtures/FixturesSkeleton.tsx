export default function FixturesSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="h-28 animate-pulse rounded-xl bg-zinc-800"
        />
      ))}
    </div>
  );
}