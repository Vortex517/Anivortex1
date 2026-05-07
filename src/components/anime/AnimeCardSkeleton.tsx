export default function AnimeCardSkeleton() {
  return (
    <div className="group">
      <div className="aspect-[2/3] rounded-lg shimmer" />
      <div className="mt-2 space-y-1.5">
        <div className="h-3 rounded shimmer" />
        <div className="h-3 rounded shimmer w-2/3" />
      </div>
    </div>
  );
}
