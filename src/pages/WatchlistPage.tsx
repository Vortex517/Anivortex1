import { motion } from "framer-motion";
import { Bookmark, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { useAppStore } from "@/lib/store";

export default function WatchlistPage() {
  const { watchlist, removeFromWatchlist } = useAppStore();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center">
            <Bookmark className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-4xl text-white">My Watchlist</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{watchlist.length} anime saved</p>
          </div>
        </div>

        {watchlist.length === 0 ? (
          <div className="text-center py-20">
            <Bookmark className="w-16 h-16 mx-auto mb-4 opacity-20 text-primary" />
            <h2 className="text-xl font-semibold text-white mb-2">Your watchlist is empty</h2>
            <p className="text-muted-foreground mb-6">Browse anime and add them to your watchlist</p>
            <Link href="/">
              <button className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-all">
                Browse Anime
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {watchlist.map((item) => (
              <motion.div
                key={item.animeId}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative"
              >
                <Link href={`/anime/${item.animeId}`}>
                  <div className="aspect-[2/3] rounded-lg overflow-hidden bg-card border border-card-border cursor-pointer">
                    <img src={item.poster} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
                  </div>
                </Link>
                <button
                  onClick={() => removeFromWatchlist(item.animeId)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 border border-white/10 flex items-center justify-center text-white/60 hover:text-destructive hover:border-destructive/50 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="mt-2">
                  <Link href={`/anime/${item.animeId}`}>
                    <h3 className="text-sm font-medium text-white/90 line-clamp-2 hover:text-primary transition-colors cursor-pointer leading-tight">
                      {item.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.type}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
