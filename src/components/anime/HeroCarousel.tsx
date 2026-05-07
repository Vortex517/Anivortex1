import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Info, Star, ChevronLeft, ChevronRight, Tv } from "lucide-react";

interface HeroItem {
  id: string | number;
  title: string;
  description?: string;
  poster?: string;
  cover?: string;
  rank?: number;
  score?: number;
  type?: string;
  episodes?: number;
  genres?: string[];
}

interface HeroCarouselProps {
  items: HeroItem[];
}

export default function HeroCarousel({ items }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((c) => (c + 1) % items.length);
  }, [items.length]);

  const prev = () => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + items.length) % items.length);
  };

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(next, 8000);
    return () => clearInterval(timer);
  }, [next, items.length]);

  if (!items.length) return null;

  const item = items[current];
  const bgImage = item.cover || item.poster;

  return (
    <div className="relative w-full aspect-[21/9] min-h-[400px] max-h-[680px] overflow-hidden">
      {/* Background */}
      <AnimatePresence mode="sync" custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          initial={{ opacity: 0, x: direction * 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -direction * 60 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={bgImage}
            alt={item.title}
            className="w-full h-full object-cover object-top"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-[1400px] w-full mx-auto px-4 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl"
            >
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {item.rank && (
                  <span className="bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    #{item.rank} Ranked
                  </span>
                )}
                {item.type && (
                  <span className="flex items-center gap-1 text-xs text-white/70 bg-white/10 px-2.5 py-1 rounded-full">
                    <Tv className="w-3 h-3" />
                    {item.type}
                  </span>
                )}
                {item.score && (
                  <span className="flex items-center gap-1 text-xs text-yellow-400 bg-yellow-400/10 px-2.5 py-1 rounded-full">
                    <Star className="w-3 h-3 fill-yellow-400" />
                    {item.score.toFixed(1)}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="font-display text-5xl md:text-7xl text-white leading-none mb-3 text-glow-red">
                {item.title}
              </h1>

              {/* Genres */}
              {item.genres && item.genres.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {item.genres.slice(0, 4).map((g) => (
                    <span key={g} className="text-xs text-white/60 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                      {g}
                    </span>
                  ))}
                </div>
              )}

              {/* Description */}
              {item.description && (
                <p className="text-sm md:text-base text-white/70 line-clamp-3 mb-6 leading-relaxed">
                  {item.description.replace(/<[^>]*>/g, "")}
                </p>
              )}

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <Link href={`/anime/${item.id}`}>
                  <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-all glow-red-sm">
                    <Play className="w-4 h-4 fill-white" />
                    Watch Now
                  </button>
                </Link>
                <Link href={`/anime/${item.id}`}>
                  <button className="flex items-center gap-2 px-6 py-3 glass border border-white/20 text-white rounded-lg font-semibold hover:bg-white/10 transition-all">
                    <Info className="w-4 h-4" />
                    Details
                  </button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      {items.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 glass-dark border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 glass-dark border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                className={`h-1 rounded-full transition-all ${
                  i === current ? "bg-primary w-6" : "bg-white/30 w-2 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
