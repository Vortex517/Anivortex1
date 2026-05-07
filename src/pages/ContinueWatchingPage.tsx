import { motion } from "framer-motion";
import { Play, Clock, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { useAppStore } from "@/lib/store";

export default function ContinueWatchingPage() {
  const { watchHistory, addToWatchHistory } = useAppStore();

  const sorted = [...watchHistory].sort((a, b) => b.timestamp - a.timestamp);

  function formatTime(ts: number) {
    const now = Date.now();
    const diff = now - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center">
            <Play className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-4xl text-white">Continue Watching</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{sorted.length} anime in progress</p>
          </div>
        </div>

        {sorted.length === 0 ? (
          <div className="text-center py-20">
            <Play className="w-16 h-16 mx-auto mb-4 opacity-20 text-primary" />
            <h2 className="text-xl font-semibold text-white mb-2">Nothing to continue</h2>
            <p className="text-muted-foreground mb-6">Start watching anime to track your progress</p>
            <Link href="/">
              <button className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-all">
                Discover Anime
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sorted.map((item) => (
              <motion.div
                key={item.episodeId}
                layout
                className="glass border border-white/10 rounded-xl overflow-hidden hover:border-primary/30 transition-all group"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img src={item.poster} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 gradient-card-overlay" />
                  <Link href={`/watch/${item.animeId}/${item.episodeId}`}>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
                        <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                      </div>
                    </div>
                  </Link>
                  {/* Progress bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${(item.progress || 0) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="p-3">
                  <Link href={`/anime/${item.animeId}`}>
                    <h3 className="font-semibold text-white hover:text-primary transition-colors cursor-pointer line-clamp-1 text-sm">
                      {item.title}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">Episode {item.episodeNumber}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {formatTime(item.timestamp)}
                    </span>
                  </div>
                  <Link href={`/watch/${item.animeId}/${item.episodeId}`}>
                    <button className="w-full mt-3 py-2 bg-primary/20 border border-primary/40 text-primary text-xs font-semibold rounded-lg hover:bg-primary/30 transition-all flex items-center justify-center gap-1.5">
                      <Play className="w-3 h-3 fill-primary" />
                      Continue Watching
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
