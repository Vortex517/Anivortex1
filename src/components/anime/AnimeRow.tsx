import { useRef } from "react";
import { Link } from "wouter";
import { ChevronRight, ChevronLeft } from "lucide-react";
import AnimeCard from "./AnimeCard";
import AnimeCardSkeleton from "./AnimeCardSkeleton";

interface AnimeItem {
  id: string | number;
  title?: string;
  name?: string;
  poster?: string;
  image?: string;
  images?: { jpg: { large_image_url: string } };
  score?: number;
  type?: string;
  episodes?: number | null;
  rank?: number;
  episodesSub?: number;
  episodesDub?: number;
}

interface AnimeRowProps {
  title: string;
  href?: string;
  items: AnimeItem[];
  loading?: boolean;
  itemCount?: number;
}

function normalizeItem(item: AnimeItem, index: number) {
  const rawEp = item.episodes;
  const episodes = typeof rawEp === "number" ? rawEp : undefined;
  return {
    id: item.id,
    title: item.title || item.name || "Unknown",
    poster: item.poster || item.image || item.images?.jpg?.large_image_url || "",
    score: typeof item.score === "number" ? item.score : undefined,
    type: item.type,
    episodes,
    rank: item.rank,
    sub: typeof item.episodesSub === "number" ? item.episodesSub : undefined,
    dub: typeof item.episodesDub === "number" ? item.episodesDub : undefined,
  };
}

export default function AnimeRow({ title, href, items, loading, itemCount = 12 }: AnimeRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.7;
    scrollRef.current.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" });
  };

  return (
    <section className="relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">{title}</h2>
        {href && (
          <Link href={href}>
            <button className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors font-medium">
              View All
              <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        )}
      </div>

      <div className="relative group/row">
        <button
          onClick={() => scroll("left")}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full glass-dark border border-white/10 flex items-center justify-center text-white opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-white/10"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto hide-scrollbar pb-2"
        >
          {loading
            ? Array.from({ length: itemCount }).map((_, i) => (
                <div key={i} className="flex-none w-[140px] sm:w-[160px]">
                  <AnimeCardSkeleton />
                </div>
              ))
            : items.slice(0, itemCount).map((item, i) => (
                <div key={`${item.id}-${i}`} className="flex-none w-[140px] sm:w-[160px]">
                  <AnimeCard {...normalizeItem(item, i)} />
                </div>
              ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full glass-dark border border-white/10 flex items-center justify-center text-white opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-white/10"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
