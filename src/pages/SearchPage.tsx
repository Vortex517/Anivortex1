import { useState } from "react";
import { useSearch as useSearchHook } from "wouter";
import { motion } from "framer-motion";
import { Search, Filter, Loader2 } from "lucide-react";
import AnimeCard from "@/components/anime/AnimeCard";
import AnimeCardSkeleton from "@/components/anime/AnimeCardSkeleton";
import { useSearch } from "@/hooks/useAnime";

export default function SearchPage() {
  const searchString = useSearchHook();
  const params = new URLSearchParams(searchString);
  const initialQuery = params.get("q") || "";

  const [inputValue, setInputValue] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useSearch(query, page, query.length >= 2);
  const animes = data?.animes || data?.results || [];
  const totalPages = data?.totalPages || data?.last_page || 1;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setQuery(inputValue);
    setPage(1);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10">
        {/* Search header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl text-white mb-6">Search Anime</h1>
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search anime by title..."
                className="w-full pl-12 pr-4 py-3 bg-card border border-card-border rounded-xl text-white placeholder:text-muted-foreground outline-none focus:border-primary/60 transition-colors text-base"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
          </form>
        </div>

        {/* Results */}
        {!query || query.length < 2 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Search className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg">Enter at least 2 characters to search</p>
          </div>
        ) : (
          <>
            {!isLoading && (
              <div className="mb-6 flex items-center justify-between">
                <p className="text-muted-foreground">
                  Results for <span className="text-white font-semibold">"{query}"</span>
                  {animes.length > 0 && <span> — {animes.length}+ found</span>}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {isLoading
                ? Array.from({ length: 12 }).map((_, i) => <AnimeCardSkeleton key={i} />)
                : animes.map((anime: any, i: number) => (
                    <AnimeCard
                      key={`${anime.id}-${i}`}
                      id={anime.id}
                      title={anime.name || anime.title || anime.title_english || "Unknown"}
                      poster={anime.poster || anime.image || anime.images?.jpg?.large_image_url || ""}
                      type={anime.type}
                      sub={anime.episodes?.sub}
                      dub={anime.episodes?.dub}
                    />
                  ))}
            </div>

            {!isLoading && animes.length === 0 && (
              <div className="text-center py-20">
                <p className="text-xl font-semibold text-white mb-2">No results found</p>
                <p className="text-muted-foreground">Try different keywords</p>
              </div>
            )}

            {/* Pagination */}
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
          </>
        )}
      </div>
    </motion.div>
  );
}
