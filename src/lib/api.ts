const BASE_URL = import.meta.env.BASE_URL.replace(/\/$/, "") + "/api/hianime";

async function fetcher<T>(endpoint: string): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  const data = await response.json();
  if (data && data.success === false) {
    throw new Error(data.message || "API returned success: false");
  }
  return data.data || data;
}

export const api = {
  fetchHome: () => fetcher<any>("/home"),
  fetchSearch: (q: string, page: number = 1, genres?: string) => {
    let url = `/search?q=${encodeURIComponent(q)}&page=${page}`;
    if (genres) url += `&genres=${encodeURIComponent(genres)}`;
    return fetcher<any>(url);
  },
  fetchAnimeInfo: (id: string) => fetcher<any>(`/anime/${id}`),
  fetchEpisodes: (animeId: string) => fetcher<any>(`/anime/${animeId}/episodes`),
  fetchEpisodeSources: (episodeId: string, server?: string, category?: string) => {
    let url = `/episode/sources?animeEpisodeId=${episodeId}`;
    if (server) url += `&server=${server}`;
    if (category) url += `&category=${category}`;
    return fetcher<any>(url);
  },
  fetchSchedule: (date: string) => fetcher<any>(`/schedule?date=${date}`),
  fetchCategory: (category: string, page: number = 1) => fetcher<any>(`/category/${category}?page=${page}`),
  fetchGenre: (genre: string, page: number = 1) => fetcher<any>(`/genre/${genre}?page=${page}`),
  fetchProducer: (producer: string, page: number = 1) => fetcher<any>(`/producer/${producer}?page=${page}`),
};
