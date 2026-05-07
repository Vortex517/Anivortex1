import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { useSearch } from "@/hooks/useAnime";
import { useDebounce } from "@/hooks/useDebounce";

const trending = ["One Piece", "Naruto", "Attack on Titan", "Demon Slayer", "Jujutsu Kaisen", "Dragon Ball"];

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const debounced = useDebounce(query, 400);

  const { data, isLoading } = useSearch(debounced, 1, open && debounced.length >= 2);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const animes = data?.animes || data?.results || [];

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative max-w-2xl mx-auto mt-16 mx-4 sm:mx-auto"
          >
            <div className="glass-dark border border-white/10 rounded-2xl shadow-2xl overflow-hidden mx-4">
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
                {isLoading ? (
                  <Loader2 className="w-5 h-5 text-muted-foreground animate-spin flex-none" />
                ) : (
                  <Search className="w-5 h-5 text-muted-foreground flex-none" />
                )}
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search anime..."
                  className="flex-1 bg-transparent text-white placeholder:text-muted-foreground outline-none text-base"
                />
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-white hover:bg-white/5 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Results / Trending */}
              <div className="max-h-[60vh] overflow-y-auto hide-scrollbar">
                {debounced.length < 2 ? (
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      <span className="text-sm font-semibold text-white">Trending Searches</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {trending.map((t) => (
                        <button
                          key={t}
                          onClick={() => setQuery(t)}
                          className="px-3 py-1.5 glass border border-white/10 text-sm text-white/70 hover:text-white rounded-full transition-all"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : animes.length === 0 && !isLoading ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No results found for "{debounced}"
                  </div>
                ) : (
                  <div className="p-2">
                    {animes.slice(0, 8).map((anime: any) => (
                      <Link
                        key={anime.id}
                        href={`/anime/${anime.id}`}
                        onClick={onClose}
                      >
                        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer group">
                          <img
                            src={anime.poster || anime.image || anime.images?.jpg?.image_url}
                            alt={anime.title || anime.name}
                            className="w-12 h-16 object-cover rounded-lg flex-none"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-white group-hover:text-primary transition-colors truncate">
                              {anime.title || anime.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              {anime.type && (
                                <span className="text-xs text-muted-foreground">{anime.type}</span>
                              )}
                              {anime.episodes && (
                                <span className="text-xs text-muted-foreground">{anime.episodes} eps</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                    {animes.length > 0 && (
                      <Link href={`/search?q=${encodeURIComponent(debounced)}`} onClick={onClose}>
                        <div className="text-center py-3 text-sm text-primary hover:underline cursor-pointer">
                          View all results for "{debounced}"
                        </div>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
