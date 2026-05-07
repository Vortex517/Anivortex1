import { Link } from "wouter";

export default function Footer() {
  const genres = ["Action", "Comedy", "Drama", "Fantasy", "Horror", "Romance", "Sci-Fi", "Thriller"];

  return (
    <footer className="border-t border-white/5 bg-black/40 mt-16">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
                <span className="font-display text-white text-base">A</span>
              </div>
              <span className="font-display text-xl tracking-wider text-white">
                ANI<span className="text-primary">VORTEX</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Your ultimate destination for anime streaming. Watch thousands of anime series in HD quality.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Navigation</h4>
            <ul className="space-y-2">
              {[["Home", "/"], ["Trending", "/trending"], ["Top Airing", "/top-airing"], ["Schedule", "/schedule"]].map(([label, href]) => (
                <li key={href}>
                  <Link href={href}>
                    <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Genres</h4>
            <div className="grid grid-cols-2 gap-1">
              {genres.map((g) => (
                <Link key={g} href={`/genre/${g.toLowerCase().replace(/ /g, "-")}`}>
                  <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer block">{g}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2025 AniVortex. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Anime data powered by <a href="https://jikan.moe" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Jikan API</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
