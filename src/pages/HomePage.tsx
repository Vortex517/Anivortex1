import { motion } from "framer-motion";
import HeroCarousel from "@/components/anime/HeroCarousel";
import AnimeRow from "@/components/anime/AnimeRow";
import { useHomeData } from "@/hooks/useAnime";

export default function HomePage() {
  const { data, isLoading } = useHomeData();

  const spotlightAnimes = data?.spotlightAnimes || [];
  const trendingAnimes = data?.trendingAnimes || [];
  const latestEpisodeAnimes = data?.latestEpisodeAnimes || [];
  const topUpcomingAnimes = data?.topUpcomingAnimes || [];
  const topAiringAnimes = data?.topAiringAnimes || [];
  const mostPopularAnimes = data?.mostPopularAnimes || [];
  const mostFavoriteAnimes = data?.mostFavoriteAnimes || [];
  const latestCompletedAnimes = data?.latestCompletedAnimes || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero */}
      {(isLoading || spotlightAnimes.length > 0) && (
        <div className="-mt-0">
          {isLoading ? (
            <div className="w-full aspect-[21/9] min-h-[400px] max-h-[680px] shimmer" />
          ) : (
            <HeroCarousel items={spotlightAnimes.slice(0, 5).map((a: any) => ({
              id: a.id,
              title: a.name || a.title,
              description: a.description,
              poster: a.poster,
              cover: a.poster,
              rank: a.rank,
              score: a.episodes?.sub ?? a.episodes?.dub,
              type: a.otherInfo?.[0],
              genres: a.genres || [],
            }))} />
          )}
        </div>
      )}

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10 space-y-10">
        {/* Trending */}
        <AnimeRow
          title="Trending Now"
          href="/trending"
          items={trendingAnimes.map((a: any) => ({
            id: a.id,
            title: a.name || a.title,
            poster: a.poster,
            rank: a.rank,
            type: a.type,
            episodesSub: a.episodes?.sub,
            episodesDub: a.episodes?.dub,
          }))}
          loading={isLoading}
          itemCount={12}
        />

        {/* Latest Episodes */}
        <AnimeRow
          title="Latest Episodes"
          items={latestEpisodeAnimes.map((a: any) => ({
            id: a.id,
            title: a.name || a.title,
            poster: a.poster,
            type: a.type,
            episodesSub: a.episodes?.sub,
            episodesDub: a.episodes?.dub,
          }))}
          loading={isLoading}
          itemCount={12}
        />

        {/* Top Airing */}
        <AnimeRow
          title="Top Airing"
          href="/top-airing"
          items={topAiringAnimes.map((a: any) => ({
            id: a.id,
            title: a.name || a.title,
            poster: a.poster,
            rank: a.rank,
            type: a.type,
            episodesSub: a.episodes?.sub,
            episodesDub: a.episodes?.dub,
          }))}
          loading={isLoading}
          itemCount={12}
        />

        {/* Most Popular */}
        <AnimeRow
          title="Most Popular"
          items={mostPopularAnimes.map((a: any) => ({
            id: a.id,
            title: a.name || a.title,
            poster: a.poster,
            rank: a.rank,
            type: a.type,
            episodesSub: a.episodes?.sub,
            episodesDub: a.episodes?.dub,
          }))}
          loading={isLoading}
          itemCount={12}
        />

        {/* Most Favorited */}
        {mostFavoriteAnimes.length > 0 && (
          <AnimeRow
            title="Most Favorited"
            items={mostFavoriteAnimes.map((a: any) => ({
              id: a.id,
              title: a.name || a.title,
              poster: a.poster,
              rank: a.rank,
              type: a.type,
              episodesSub: a.episodes?.sub,
              episodesDub: a.episodes?.dub,
            }))}
            loading={isLoading}
            itemCount={12}
          />
        )}

        {/* Top Upcoming */}
        {topUpcomingAnimes.length > 0 && (
          <AnimeRow
            title="Top Upcoming"
            items={topUpcomingAnimes.map((a: any) => ({
              id: a.id,
              title: a.name || a.title,
              poster: a.poster,
              rank: a.rank,
              type: a.type,
              episodesSub: a.episodes?.sub,
              episodesDub: a.episodes?.dub,
            }))}
            loading={isLoading}
            itemCount={12}
          />
        )}

        {/* Latest Completed */}
        {latestCompletedAnimes.length > 0 && (
          <AnimeRow
            title="Recently Completed"
            items={latestCompletedAnimes.map((a: any) => ({
              id: a.id,
              title: a.name || a.title,
              poster: a.poster,
              type: a.type,
              episodesSub: a.episodes?.sub,
              episodesDub: a.episodes?.dub,
            }))}
            loading={isLoading}
            itemCount={12}
          />
        )}
      </div>
    </motion.div>
  );
}
