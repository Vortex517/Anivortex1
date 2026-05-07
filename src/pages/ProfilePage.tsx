import { motion } from "framer-motion";
import { User, Bookmark, Play, Clock, Star } from "lucide-react";
import { Link } from "wouter";
import { useAppStore } from "@/lib/store";

export default function ProfilePage() {
  const { currentUser, watchlist, watchHistory } = useAppStore();

  const stats = [
    { label: "Watchlist", value: watchlist.length, icon: Bookmark, color: "text-primary" },
    { label: "Watched", value: watchHistory.length, icon: Play, color: "text-green-400" },
    { label: "Episodes", value: watchHistory.reduce((a, _) => a + 1, 0), icon: Clock, color: "text-blue-400" },
  ];

  const recentHistory = [...watchHistory].sort((a, b) => b.timestamp - a.timestamp).slice(0, 8);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen">
      <div className="max-w-[1000px] mx-auto px-4 lg:px-8 py-10">
        {/* Profile header */}
        <div className="glass border border-white/10 rounded-2xl p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center overflow-hidden flex-none">
              {currentUser?.avatar ? (
                <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-primary" />
              )}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-white">{currentUser?.name || "Guest User"}</h1>
              <p className="text-muted-foreground mt-1">{currentUser?.email || "guest@anivortex.local"}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-4">
                {stats.map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="flex items-center gap-2 glass border border-white/10 px-4 py-2 rounded-full">
                    <Icon className={`w-4 h-4 ${color}`} />
                    <span className="text-white font-bold">{value}</span>
                    <span className="text-muted-foreground text-sm">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Link href="/watchlist">
            <div className="glass border border-white/10 rounded-xl p-5 hover:border-primary/30 transition-all cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Bookmark className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-white group-hover:text-primary transition-colors">My Watchlist</h3>
                  <p className="text-sm text-muted-foreground">{watchlist.length} anime saved</p>
                </div>
              </div>
            </div>
          </Link>
          <Link href="/continue-watching">
            <div className="glass border border-white/10 rounded-xl p-5 hover:border-primary/30 transition-all cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <Play className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white group-hover:text-primary transition-colors">Continue Watching</h3>
                  <p className="text-sm text-muted-foreground">{watchHistory.length} in progress</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent history */}
        {recentHistory.length > 0 && (
          <div className="glass border border-white/10 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10">
              <h2 className="font-bold text-white">Recently Watched</h2>
            </div>
            <div className="divide-y divide-white/5">
              {recentHistory.map((item) => (
                <Link key={`${item.animeId}-${item.episodeId}`} href={`/watch/${item.animeId}/${item.episodeId}`}>
                  <div className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-all cursor-pointer group">
                    <img src={item.poster} alt={item.title} className="w-12 h-16 object-cover rounded-lg flex-none" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white group-hover:text-primary transition-colors truncate">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">Episode {item.episodeNumber}</p>
                      <div className="w-full bg-white/10 rounded-full h-1 mt-2">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${(item.progress || 0) * 100}%` }} />
                      </div>
                    </div>
                    <div className="flex-none text-right">
                      <p className="text-xs text-muted-foreground">{Math.round((item.progress || 0) * 100)}%</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
