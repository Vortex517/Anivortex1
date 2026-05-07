import { useState } from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import {
  Play, Bookmark, BookmarkCheck, Star, Tv, Film, Clock,
  Calendar, Tag, ChevronRight, Loader2, ExternalLink
} from "lucide-react";
import AnimeRow from "@/components/anime/AnimeRow";
import AnimeCardSkeleton from "@/components/anime/AnimeCardSkeleton";
import { useAnimeInfo, useEpisodes } from "@/hooks/useAnime";
import { useAppStore } from "@/lib/store";

export default function AnimeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: info, isLoading, error } = useAnimeInfo(id);
  const { data: episodesData, isLoading: epLoading } = useEpisodes(id);
  const { watchlist, addToWatchlist, removeFromWatchlist } = useAppStore();
  const [showAllEp, setShowAllEp] = useState(false);

  const anime = info?.anime?.info || info?.anime || info;
  const moreInfo = info?.anime?.moreInfo || {};
  const related = info?.relatedAnimes || [];
  const recommended = info?.recommendedAnimes || [];
  const seasons = info?.seasons || [];

  const episodes = episodesData?.episodes || [];
  const visibleEpisodes = showAllEp ? episodes : episodes.slice(0, 24);

  const isInWatchlist = watchlist.some((i) => i.animeId === id);

  function toggleWatchlist() {
    if (isInWatchlist) {
      removeFromWatchlist(id);
    } else if (anime) {
      addToWatchlist({
        animeId: id,
        title: anime.name || anime.title || "",
        poster: anime.poster || "",
        type: anime.info?.stats?.type || anime.type || "",
        episodes: { sub: anime.info?.stats?.episodes?.sub, dub: anime.info?.stats?.episodes?.dub },
      });
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="w-full h-80 shimmer" />
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10">
          <div className="flex gap-6">
            <div className="w-44 h-64 rounded-xl shimmer flex-none" />
            <div className="flex-1 space-y-4">
              <div className="h-8 rounded shimmer w-3/4" />
              <div className="h-4 rounded shimmer w-1/2" />
              <div className="h-20 rounded shimmer" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold mb-2">Anime not found</p>
          <Link href="/"><button className="text-primary hover:underline">Go Home</button></Link>
        </div>
      </div>
    );
  }

  const name = anime.name || anime.title || "Unknown";
  const poster = anime.poster || anime.image || "";
  const description = anime.description || moreInfo.description || "";
  const stats = anime.info?.stats || {};
  const score = stats.score || anime.score;
  const type = stats.type || anime.type;
  const episodes_sub = stats.episodes?.sub ?? anime.episodesSub;
  const episodes_dub = stats.episodes?.dub ?? anime.episodesDub;
  const genres = moreInfo.genres || anime.genres || [];
  const studios = moreInfo.studios ? (Array.isArray(moreInfo.studios) ? moreInfo.studios : [moreInfo.studios]) : [];
  const aired = moreInfo.aired || moreInfo.aired_string || "";
  const status = moreInfo.status || anime.status || "";
  const duration = moreInfo.duration || stats.duration || "";
  const firstEpisode = episodes[0];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Background */}
      <div className="relative h-80 overflow-hidden -mt-16 pt-16">
        <img
          src={poster}
          alt={name}
          className="w-full h-full object-cover object-top filter blur-sm opacity-30 scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 -mt-40 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-none">
            <div className="w-44 md:w-52 rounded-xl overflow-hidden border-2 border-white/10 shadow-2xl">
              <img src={poster} alt={name} className="w-full" referrerPolicy="no-referrer" />
            </div>
            <div className="mt-3 space-y-2">
              {firstEpisode && (
                <Link href={`/watch/${id}/${firstEpisode.episodeId}`}>
                  <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-all text-sm glow-red-sm">
                    <Play className="w-4 h-4 fill-white" />
                    Watch Now
                  </button>
                </Link>
              )}
              <button
                onClick={toggleWatchlist}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold transition-all text-sm border ${
                  isInWatchlist
                    ? "bg-primary/20 border-primary/50 text-primary"
                    : "glass border-white/10 text-white hover:bg-white/5"
                }`}
              >
                {isInWatchlist ? (
                  <><BookmarkCheck className="w-4 h-4" /> In Watchlist</>
                ) : (
                  <><Bookmark className="w-4 h-4" /> Add to Watchlist</>
                )}
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 pt-24 md:pt-32">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">{name}</h1>

            {/* Meta badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {score && (
                <span className="flex items-center gap-1 text-sm text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-2.5 py-1 rounded-full">
                  <Star className="w-3.5 h-3.5 fill-yellow-400" />
                  {typeof score === "number" ? score.toFixed(1) : score}
                </span>
              )}
              {type && (
                <span className="flex items-center gap-1 text-sm text-white/70 glass border-white/10 px-2.5 py-1 rounded-full">
                  {type === "Movie" ? <Film className="w-3.5 h-3.5" /> : <Tv className="w-3.5 h-3.5" />}
                  {type}
                </span>
              )}
              {status && (
                <span className={`text-sm px-2.5 py-1 rounded-full border ${
                  status === "Currently Airing"
                    ? "bg-green-500/10 border-green-500/30 text-green-400"
                    : "glass border-white/10 text-white/70"
                }`}>{status}</span>
              )}
              {duration && (
                <span className="flex items-center gap-1 text-sm text-white/60 glass border-white/10 px-2.5 py-1 rounded-full">
                  <Clock className="w-3.5 h-3.5" />
                  {duration}
                </span>
              )}
              {episodes_sub !== undefined && (
                <span className="text-sm bg-primary/20 text-primary border border-primary/30 px-2.5 py-1 rounded-full font-medium">
                  Sub: {episodes_sub}
                </span>
              )}
              {episodes_dub !== undefined && (
                <span className="text-sm bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2.5 py-1 rounded-full font-medium">
                  Dub: {episodes_dub}
                </span>
              )}
            </div>

            {/* Genres */}
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {genres.map((g: string) => (
                  <Link key={g} href={`/genre/${g.toLowerCase().replace(/ /g, "-")}`}>
                    <span className="flex items-center gap-1 text-xs text-white/60 glass border border-white/10 px-2.5 py-1 rounded-full hover:text-primary hover:border-primary/30 transition-all cursor-pointer">
                      <Tag className="w-3 h-3" />
                      {g}
                    </span>
                  </Link>
                ))}
              </div>
            )}

            {/* Description */}
            {description && (
              <p className="text-sm text-white/70 leading-relaxed mb-4 max-w-2xl line-clamp-4">
                {description.replace(/<[^>]*>/g, "")}
              </p>
            )}

            {/* Additional info */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {aired && (
                <div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Aired
                  </span>
                  <span className="text-sm text-white/80">{aired}</span>
                </div>
              )}
              {studios.length > 0 && (
                <div>
                  <span className="text-xs text-muted-foreground">Studio</span>
                  <p className="text-sm text-white/80">{studios.join(", ")}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Seasons */}
        {seasons.length > 1 && (
          <div className="mt-8">
            <h3 className="text-lg font-bold text-white mb-3">Seasons</h3>
            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
              {seasons.map((s: any) => (
                <Link key={s.id} href={`/anime/${s.id}`}>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium cursor-pointer flex-none transition-all ${
                    s.id.toString() === id
                      ? "bg-primary/20 border-primary/50 text-primary"
                      : "glass border-white/10 text-white/70 hover:text-white"
                  }`}>
                    {s.isCurrent && <ChevronRight className="w-3 h-3" />}
                    {s.title || s.name}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Episodes */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Episodes</h3>
            {episodes.length > 24 && (
              <button
                onClick={() => setShowAllEp(!showAllEp)}
                className="text-sm text-primary hover:underline"
              >
                {showAllEp ? "Show Less" : `Show All (${episodes.length})`}
              </button>
            )}
          </div>
          {epLoading ? (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="h-10 rounded shimmer" />
              ))}
            </div>
          ) : episodes.length === 0 ? (
            <p className="text-muted-foreground">No episodes found.</p>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
              {visibleEpisodes.map((ep: any) => (
                <Link key={ep.episodeId} href={`/watch/${id}/${ep.episodeId}`}>
                  <div
                    className={`h-10 rounded-lg flex items-center justify-center text-sm font-semibold cursor-pointer transition-all border ${
                      ep.isFiller
                        ? "glass border-yellow-500/20 text-yellow-400/70 hover:bg-yellow-500/10"
                        : "glass border-white/10 text-white/80 hover:bg-primary/20 hover:border-primary/50 hover:text-primary"
                    }`}
                    title={ep.title || `Episode ${ep.number}`}
                  >
                    {ep.number}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Related / Recommended */}
        <div className="mt-10 space-y-10 pb-10">
          {related.length > 0 && (
            <AnimeRow
              title="Related Anime"
              items={related.map((a: any) => ({
                id: a.id,
                title: a.name || a.title,
                poster: a.poster,
                type: a.type,
              }))}
              itemCount={12}
            />
          )}
          {recommended.length > 0 && (
            <AnimeRow
              title="Recommended"
              items={recommended.map((a: any) => ({
                id: a.id,
                title: a.name || a.title,
                poster: a.poster,
                type: a.type,
                episodesSub: a.episodes?.sub,
                episodesDub: a.episodes?.dub,
              }))}
              itemCount={12}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
