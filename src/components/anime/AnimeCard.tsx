import { Link } from "wouter";
import { motion } from "framer-motion";
import { Play, Star, Tv, Film } from "lucide-react";

interface AnimeCardProps {
  id: string | number;
  title: string;
  poster: string;
  rank?: number;
  score?: number;
  type?: string;
  episodes?: number;
  status?: string;
  sub?: number;
  dub?: number;
  className?: string;
}

export default function AnimeCard({
  id,
  title,
  poster,
  rank,
  score,
  type,
  episodes,
  sub,
  dub,
  className = "",
}: AnimeCardProps) {
  return (
    <Link href={`/anime/${id}`}>
      <motion.div
        className={`group relative cursor-pointer ${className}`}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-card border border-card-border">
          <img
            src={poster}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            referrerPolicy="no-referrer"
          />

          {/* Overlay */}
          <div className="absolute inset-0 gradient-card-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center glow-red-sm">
              <Play className="w-5 h-5 text-white fill-white ml-0.5" />
            </div>
          </div>

          {/* Rank badge */}
          {rank && (
            <div className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-0.5 rounded">
              #{rank}
            </div>
          )}

          {/* Score badge */}
          {score && (
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 text-yellow-400 text-xs font-semibold px-2 py-0.5 rounded">
              <Star className="w-3 h-3 fill-yellow-400" />
              {score.toFixed(1)}
            </div>
          )}

          {/* Sub/Dub badges */}
          <div className="absolute bottom-2 left-2 flex gap-1">
            {(sub || sub === 0) && (
              <span className="bg-primary/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                SUB {sub}
              </span>
            )}
            {(dub || dub === 0) && (
              <span className="bg-blue-500/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                DUB {dub}
              </span>
            )}
          </div>

          {/* Type */}
          {type && (
            <div className="absolute bottom-2 right-2 flex items-center gap-1 text-[10px] text-white/70 bg-black/50 px-1.5 py-0.5 rounded">
              {type === "Movie" ? <Film className="w-2.5 h-2.5" /> : <Tv className="w-2.5 h-2.5" />}
              {type}
            </div>
          )}
        </div>

        <div className="mt-2 px-0.5">
          <h3 className="text-sm font-medium text-white/90 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
            {title}
          </h3>
          {episodes && (
            <p className="text-xs text-muted-foreground mt-0.5">{episodes} eps</p>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
