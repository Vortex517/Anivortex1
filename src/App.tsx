import React, { Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";
import Layout from "@/components/layout/Layout";
import NotFound from "@/pages/not-found";

const HomePage = React.lazy(() => import("@/pages/HomePage"));
const AnimeDetailPage = React.lazy(() => import("@/pages/AnimeDetailPage"));
const WatchPage = React.lazy(() => import("@/pages/WatchPage"));
const SearchPage = React.lazy(() => import("@/pages/SearchPage"));
const GenrePage = React.lazy(() => import("@/pages/GenrePage"));
const TrendingPage = React.lazy(() => import("@/pages/TrendingPage"));
const TopAiringPage = React.lazy(() => import("@/pages/TopAiringPage"));
const SchedulePage = React.lazy(() => import("@/pages/SchedulePage"));
const ProfilePage = React.lazy(() => import("@/pages/ProfilePage"));
const WatchlistPage = React.lazy(() => import("@/pages/WatchlistPage"));
const ContinueWatchingPage = React.lazy(() => import("@/pages/ContinueWatchingPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function PageLoader() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-2 border-primary/30 rounded-full" />
          <div className="absolute inset-0 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <span className="text-muted-foreground text-sm">Loading...</span>
      </div>
    </div>
  );
}

function Router() {
  return (
    <AnimatePresence mode="wait">
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/home" component={HomePage} />
        <Route path="/anime/:id" component={AnimeDetailPage} />
        <Route path="/watch/:animeId/:episodeId" component={WatchPage} />
        <Route path="/search" component={SearchPage} />
        <Route path="/genre/:genre" component={GenrePage} />
        <Route path="/trending" component={TrendingPage} />
        <Route path="/top-airing" component={TopAiringPage} />
        <Route path="/schedule" component={SchedulePage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/watchlist" component={WatchlistPage} />
        <Route path="/continue-watching" component={ContinueWatchingPage} />
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Layout>
            <Suspense fallback={<PageLoader />}>
              <Router />
            </Suspense>
          </Layout>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
