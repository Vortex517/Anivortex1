import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight, Clock, Tv } from "lucide-react";
import { Link } from "wouter";
import { useSchedule } from "@/hooks/useAnime";

function formatDate(date: Date) {
  return date.toISOString().split("T")[0];
}

function displayDate(date: Date) {
  return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

export default function SchedulePage() {
  const [date, setDate] = useState(new Date());
  const { data, isLoading } = useSchedule(formatDate(date));

  const scheduledAnimes = data?.scheduledAnimes || [];

  const changeDay = (delta: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + delta);
    setDate(d);
  };

  const isToday = formatDate(date) === formatDate(new Date());

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="font-display text-4xl text-white">Schedule</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Anime airing schedule</p>
          </div>
        </div>

        {/* Date navigator */}
        <div className="flex items-center gap-4 mb-8 glass border border-white/10 rounded-xl p-4 w-fit">
          <button onClick={() => changeDay(-1)} className="w-9 h-9 rounded-lg glass border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="text-center min-w-[200px]">
            <p className="text-white font-semibold">{displayDate(date)}</p>
            {isToday && <span className="text-xs text-primary font-medium">Today</span>}
          </div>
          <button onClick={() => changeDay(1)} className="w-9 h-9 rounded-lg glass border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Schedule list */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-20 rounded-xl shimmer" />
            ))}
          </div>
        ) : scheduledAnimes.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg">No anime scheduled for this day</p>
          </div>
        ) : (
          <div className="space-y-3">
            {scheduledAnimes.map((anime: any, i: number) => (
              <motion.div
                key={`${anime.id}-${i}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/anime/${anime.id}`}>
                  <div className="flex items-center gap-4 glass border border-white/10 rounded-xl p-4 hover:bg-white/5 transition-all cursor-pointer group">
                    <img
                      src={anime.poster}
                      alt={anime.name || anime.title}
                      className="w-14 h-20 object-cover rounded-lg flex-none"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white group-hover:text-primary transition-colors truncate">
                        {anime.name || anime.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 mt-1">
                        {anime.airingTimestamp && (
                          <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(anime.airingTimestamp * 1000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        )}
                        {anime.type && (
                          <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Tv className="w-3.5 h-3.5" />
                            {anime.type}
                          </span>
                        )}
                        {anime.secondsUntilAiring !== undefined && anime.secondsUntilAiring > 0 && (
                          <span className="text-xs bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded-full">
                            Ep {anime.episodes} in {Math.round(anime.secondsUntilAiring / 3600)}h
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
