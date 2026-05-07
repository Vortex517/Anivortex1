import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WatchHistoryItem {
  animeId: string;
  episodeId: string;
  episodeNumber: number;
  title: string;
  poster: string;
  progress: number;
  timestamp: number;
}

export interface WatchlistItem {
  animeId: string;
  title: string;
  poster: string;
  type: string;
  episodes: { sub?: number; dub?: number };
}

export interface User {
  name: string;
  avatar: string;
  email: string;
}

interface AppState {
  watchHistory: WatchHistoryItem[];
  watchlist: WatchlistItem[];
  continueWatching: WatchHistoryItem[];
  currentUser: User | null;

  addToWatchHistory: (item: WatchHistoryItem) => void;
  updateProgress: (episodeId: string, progress: number) => void;
  addToWatchlist: (item: WatchlistItem) => void;
  removeFromWatchlist: (animeId: string) => void;
  setCurrentUser: (user: User | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      watchHistory: [],
      watchlist: [],
      continueWatching: [],
      currentUser: {
        name: "Guest User",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
        email: "guest@anivortex.local"
      },

      addToWatchHistory: (item) => set((state) => {
        const filtered = state.watchHistory.filter(i => i.animeId !== item.animeId);
        const newHistory = [item, ...filtered].slice(0, 100);
        return {
          watchHistory: newHistory,
          continueWatching: newHistory
        };
      }),

      updateProgress: (episodeId, progress) => set((state) => {
        const history = state.watchHistory.map(item =>
          item.episodeId === episodeId ? { ...item, progress, timestamp: Date.now() } : item
        );
        return {
          watchHistory: history,
          continueWatching: history
        };
      }),

      addToWatchlist: (item) => set((state) => {
        if (state.watchlist.some(i => i.animeId === item.animeId)) return state;
        return { watchlist: [item, ...state.watchlist] };
      }),

      removeFromWatchlist: (animeId) => set((state) => ({
        watchlist: state.watchlist.filter(i => i.animeId !== animeId)
      })),

      setCurrentUser: (user) => set({ currentUser: user }),
    }),
    {
      name: "anivortex-storage",
    }
  )
);
