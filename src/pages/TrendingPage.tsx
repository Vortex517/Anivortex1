import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import AnimeCard from "@/components/anime/AnimeCard";
import AnimeCardSkeleton from "@/components/anime/AnimeCardSkeleton";
import { useCategory } from "@/hooks/useAnime";

export default function TrendingPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useCategory("top-upcoming", page);
  const { data: trendData, isLoading: trendLoading } = useCategory("trending", page);

  const animes = trendData?.animes || data?.animes || [];
  const totalPages = trendData?.totalPages || data?.totalPages || 1;
  const loading = trendLoading || isLoading;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-4xl text-white">Trending Now</h1>
            <p className="text-sm text-muted-foreground mt-0.5">What everyone is watching</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {loading
            ? Array.from({ length: 24 }).map((_, i) => <AnimeCardSkeleton key={i} />)
            : animes.map((anime: any, i: number) => (
                <AnimeCard
                  key={`${anime.id}-${i}`}
                  id={anime.id}
                  title={anime.name || anime.title || "Unknown"}
                  poster={anime.poster || ""}
                  rank={anime.rank || ((page - 1) * 24) + i + 1}
                  type={anime.type}
                  sub={anime.episodes?.sub}
                  dub={anime.episodes?.dub}
                />
              ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg glass border border-white/10 text-white/70 disabled:opacity-40 hover:bg-white/5 transition-all text-sm"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm text-white/70">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg glass border border-white/10 text-white/70 disabled:opacity-40 hover:bg-white/5 transition-all text-sm"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
