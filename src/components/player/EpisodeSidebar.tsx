import { useRef, useEffect } from "react";
import { Link } from "wouter";
import { Play, CheckCircle } from "lucide-react";
import { useAppStore } from "@/lib/store";

interface Episode {
  episodeId: string;
  number: number;
  title?: string;
  isFiller?: boolean;
}

interface EpisodeSidebarProps {
  animeId: string;
  episodes: Episode[];
  currentEpisodeId: string;
}

export default function EpisodeSidebar({ animeId, episodes, currentEpisodeId }: EpisodeSidebarProps) {
  const { watchHistory } = useAppStore();
  const activeRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [currentEpisodeId]);

  const watchedIds = new Set(watchHistory.map((h) => h.episodeId));

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-white/10">
        <h3 className="font-semibold text-white">Episodes</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{episodes.length} episodes</p>
      </div>
      <div className="flex-1 overflow-y-auto hide-scrollbar p-2">
        {episodes.map((ep) => {
          const isActive = ep.episodeId === currentEpisodeId;
          const isWatched = watchedIds.has(ep.episodeId);

          return (
            <Link
              key={ep.episodeId}
              href={`/watch/${animeId}/${ep.episodeId}`}
              ref={isActive ? activeRef : undefined}
            >
              <div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all mb-1 ${
                  isActive
                    ? "bg-primary/20 border border-primary/40"
                    : "hover:bg-white/5 border border-transparent"
                }`}
              >
                <div className={`w-8 h-8 rounded-md flex items-center justify-center text-sm font-bold flex-none ${
                  isActive ? "bg-primary text-white" : isWatched ? "bg-white/10 text-white/60" : "bg-white/5 text-white/70"
                }`}>
                  {isActive ? <Play className="w-3 h-3 fill-white" /> : ep.number}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-sm font-medium truncate ${isActive ? "text-primary" : "text-white/80"}`}>
                      {ep.title || `Episode ${ep.number}`}
                    </span>
                    {ep.isFiller && (
                      <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-1 rounded flex-none">F</span>
                    )}
                  </div>
                </div>
                {isWatched && !isActive && (
                  <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-none" />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
