import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Home, TrendingUp, Calendar, Flame, Bookmark, Play, User, Menu, X, ChevronDown } from "lucide-react";
import SearchModal from "@/components/search/SearchModal";

const genres = [
  "Action", "Adventure", "Comedy", "Drama", "Fantasy",
  "Horror", "Mystery", "Romance", "Sci-Fi", "Slice of Life",
  "Sports", "Supernatural", "Thriller"
];

export default function Navbar() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [genreOpen, setGenreOpen] = useState(false);
  const genreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (genreRef.current && !genreRef.current.contains(e.target as Node)) {
        setGenreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/trending", label: "Trending", icon: TrendingUp },
    { href: "/top-airing", label: "Top Airing", icon: Flame },
    { href: "/schedule", label: "Schedule", icon: Calendar },
    { href: "/watchlist", label: "Watchlist", icon: Bookmark },
    { href: "/continue-watching", label: "Continue", icon: Play },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "glass-dark border-b border-white/5 shadow-xl"
            : "bg-gradient-to-b from-black/80 to-transparent border-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <div className="flex items-center h-16 gap-6">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer flex-shrink-0">
                <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center glow-red-sm">
                  <span className="font-display text-white text-lg">A</span>
                </div>
                <span className="font-display text-2xl tracking-wider text-white">
                  ANI<span className="text-primary">VORTEX</span>
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1 flex-1">
              {navLinks.map(({ href, label }) => (
                <Link key={href} href={href}>
                  <button
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      location === href
                        ? "text-primary bg-primary/10"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {label}
                  </button>
                </Link>
              ))}

              {/* Genres dropdown */}
              <div className="relative" ref={genreRef}>
                <button
                  onClick={() => setGenreOpen(!genreOpen)}
                  className="flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all"
                >
                  Genres
                  <ChevronDown className={`w-3 h-3 transition-transform ${genreOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {genreOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute top-full left-0 mt-2 glass-dark border border-white/10 rounded-xl p-3 grid grid-cols-2 gap-1 min-w-[220px]"
                    >
                      {genres.map((g) => (
                        <Link key={g} href={`/genre/${g.toLowerCase().replace(/ /g, "-")}`}>
                          <button
                            onClick={() => setGenreOpen(false)}
                            className="w-full text-left px-3 py-1.5 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-md transition-all"
                          >
                            {g}
                          </button>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-4 py-2 glass rounded-full text-sm text-white/70 hover:text-white border-white/10 transition-all hover:border-white/20"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Search anime...</span>
              </button>

              <Link href="/profile">
                <button className="w-9 h-9 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary hover:bg-primary/30 transition-all">
                  <User className="w-4 h-4" />
                </button>
              </Link>

              <button
                className="lg:hidden w-9 h-9 rounded-md flex items-center justify-center text-white/70 hover:text-white hover:bg-white/5 transition-all"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-white/10 glass-dark"
            >
              <div className="px-4 py-4 flex flex-col gap-1">
                {navLinks.map(({ href, label, icon: Icon }) => (
                  <Link key={href} href={href}>
                    <button
                      onClick={() => setMobileOpen(false)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        location === href
                          ? "text-primary bg-primary/10"
                          : "text-white/70 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  </Link>
                ))}
                <div className="border-t border-white/10 mt-2 pt-3">
                  <p className="text-xs text-muted-foreground px-4 mb-2">Genres</p>
                  <div className="grid grid-cols-3 gap-1">
                    {genres.map((g) => (
                      <Link key={g} href={`/genre/${g.toLowerCase().replace(/ /g, "-")}`}>
                        <button
                          onClick={() => setMobileOpen(false)}
                          className="w-full text-left px-3 py-1.5 text-xs text-white/60 hover:text-white hover:bg-white/5 rounded-md transition-all"
                        >
                          {g}
                        </button>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
