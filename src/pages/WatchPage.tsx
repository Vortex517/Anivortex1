import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, AlertCircle, Loader2, Server, Subtitles } from "lucide-react";
import VideoPlayer from "@/components/player/VideoPlayer";
import EpisodeSidebar from "@/components/player/EpisodeSidebar";
import { useEpisodeSources, useEpisodes, useAnimeInfo } from "@/hooks/useAnime";
import { useAppStore } from "@/lib/store";

const SERVERS = [
  { id: "hd-1", label: "VidSrc" },
  { id: "hd-2", label: "2Embed" },
  { id: "megacloud", label: "AutoEmbed" },
];

const CATEGORIES = [
  { id: "sub", label: "SUB" },
  { id: "dub", label: "DUB" },
  { id: "raw", label: "RAW" },
];

export default function WatchPage() {
  const { animeId, episodeId } = useParams<{ animeId: string; episodeId: string }>();
  const [server, setServer] = useState("megacloud");
  const [category, setCategory] = useState("sub");

  const { data: info } = useAnimeInfo(animeId);
  const { data: episodesData } = useEpisodes(animeId);
  const { data: sourcesData, isLoading: srcLoading, error: srcError } = useEpisodeSources(episodeId, server, category);

  const { addToWatchHistory, updateProgress } = useAppStore();

  const episodes = episodesData?.episodes || [];
  const currentEpIndex = episodes.findIndex((e: any) => e.episodeId === episodeId);
  const currentEp = episodes[currentEpIndex];
  const prevEp = episodes[currentEpIndex - 1];
  const nextEp = episodes[currentEpIndex + 1];

  const animeName = info?.anime?.info?.name || info?.anime?.name || info?.name || "Anime";
  const animePoster = info?.anime?.info?.poster || info?.anime?.poster || info?.poster || "";

  const sources = sourcesData?.sources || [];
  const tracks = sourcesData?.tracks || sourcesData?.subtitles || [];
  const embedUrl: string | undefined = sourcesData?.embedUrl;

  const mainSource = sources[0];
  const hlsSrc = mainSource?.url || mainSource?.file;

  useEffect(() => {
    if (currentEp && animeName) {
      addToWatchHistory({
        animeId,
        episodeId,
        episodeNumber: currentEp.number,
        title: animeName,
        poster: animePoster,
        progress: 0,
        timestamp: Date.now(),
      });
    }
  }, [episodeId, animeId, currentEp, animeName, animePoster, addToWatchHistory]);

  const handleProgress = useCallback((progress: number) => {
    updateProgress(episodeId, progress);
  }, [episodeId, updateProgress]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background"
    >
      <div className="max-w-[1600px] mx-auto px-4 py-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/">
            <span className="hover:text-white transition-colors cursor-pointer">Home</span>
          </Link>
          <span>/</span>
          <Link href={`/anime/${animeId}`}>
            <span className="hover:text-white transition-colors cursor-pointer truncate max-w-[200px]">{animeName}</span>
          </Link>
          <span>/</span>
          <span className="text-white">Episode {currentEp?.number || "?"}</span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4">
          {/* Player area */}
          <div>
            {/* Video */}
            <div className="rounded-xl overflow-hidden bg-black">
              {srcLoading ? (
                <div className="aspect-video flex items-center justify-center bg-black">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
              ) : srcError ? (
                <div className="aspect-video flex flex-col items-center justify-center bg-black gap-3">
                  <AlertCircle className="w-12 h-12 text-destructive" />
                  <p className="text-white font-semibold">Failed to load stream</p>
                  <p className="text-sm text-muted-foreground">Try a different server or category below</p>
                </div>
              ) : (
                <VideoPlayer
                  src={hlsSrc}
                  embedUrl={embedUrl}
                  tracks={tracks.map((t: any) => ({
                    file: t.file || t.url,
                    label: t.label,
                    kind: t.kind || "subtitles",
                    default: t.default,
                  }))}
                  poster={animePoster}
                  onProgress={handleProgress}
                />
              )}
            </div>

            {/* Episode title + nav */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
              <div>
                <h1 className="text-lg font-bold text-white">
                  {animeName} — Episode {currentEp?.number}
                </h1>
                {currentEp?.title && (
                  <p className="text-sm text-muted-foreground">{currentEp.title}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {prevEp && (
                  <Link href={`/watch/${animeId}/${prevEp.episodeId}`}>
                    <button className="flex items-center gap-1.5 px-3 py-2 glass border border-white/10 rounded-lg text-sm text-white hover:bg-white/5 transition-all">
                      <ChevronLeft className="w-4 h-4" />
                      Prev
                    </button>
                  </Link>
                )}
                {nextEp && (
                  <Link href={`/watch/${animeId}/${nextEp.episodeId}`}>
                    <button className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all">
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </Link>
                )}
              </div>
            </div>

            {/* Server/Category selector */}
            <div className="mt-4 glass border border-white/10 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Server className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Server:</span>
                <div className="flex gap-2">
                  {SERVERS.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setServer(s.id)}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all border ${
                        server === s.id
                          ? "bg-primary/20 border-primary/50 text-primary"
                          : "glass border-white/10 text-white/60 hover:text-white"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Subtitles className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Category:</span>
                <div className="flex gap-2">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCategory(c.id)}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all border ${
                        category === c.id
                          ? "bg-primary/20 border-primary/50 text-primary"
                          : "glass border-white/10 text-white/60 hover:text-white"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Episode sidebar */}
          <div className="glass border border-white/10 rounded-xl overflow-hidden h-[600px] xl:h-auto xl:max-h-[calc(100vh-120px)]">
            <EpisodeSidebar
              animeId={animeId}
              episodes={episodes}
              currentEpisodeId={episodeId}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
