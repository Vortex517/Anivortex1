import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useHomeData() {
  return useQuery({
    queryKey: ["home"],
    queryFn: api.fetchHome,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSearch(query: string, page: number = 1, enabled: boolean = true) {
  return useQuery({
    queryKey: ["search", query, page],
    queryFn: () => api.fetchSearch(query, page),
    enabled: enabled && !!query,
  });
}

export function useAnimeInfo(id: string) {
  return useQuery({
    queryKey: ["anime", id],
    queryFn: () => api.fetchAnimeInfo(id),
    enabled: !!id,
  });
}

export function useEpisodes(animeId: string) {
  return useQuery({
    queryKey: ["episodes", animeId],
    queryFn: () => api.fetchEpisodes(animeId),
    enabled: !!animeId,
  });
}

export function useEpisodeSources(episodeId: string, server?: string, category?: string) {
  return useQuery({
    queryKey: ["episodeSources", episodeId, server, category],
    queryFn: () => api.fetchEpisodeSources(episodeId, server, category),
    enabled: !!episodeId,
  });
}

export function useSchedule(date: string) {
  return useQuery({
    queryKey: ["schedule", date],
    queryFn: () => api.fetchSchedule(date),
    enabled: !!date,
  });
}

export function useCategory(category: string, page: number = 1) {
  return useQuery({
    queryKey: ["category", category, page],
    queryFn: () => api.fetchCategory(category, page),
    enabled: !!category,
  });
}

export function useGenre(genre: string, page: number = 1) {
  return useQuery({
    queryKey: ["genre", genre, page],
    queryFn: () => api.fetchGenre(genre, page),
    enabled: !!genre,
  });
}
