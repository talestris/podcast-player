import {
  Podcast,
  iTunesSearchResponse,
  Episode,
  iTunesEpisode,
} from "../types";
import { formatDate, formatDuration } from "../utils/format";

function wrapWithCorsProxy(url: string): string {
  return `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
}

export async function fetchBestPodcasts(
  limit: number = 20,
): Promise<Podcast[]> {
  const targetUrl = `https://itunes.apple.com/us/rss/toppodcasts/limit=${limit}/json`;
  const response = await fetch(wrapWithCorsProxy(targetUrl));
  const proxyData = await response.json();
  const data = JSON.parse(proxyData.contents);

  return data.feed.entry.map((entry: any) => ({
    id: Number(entry.id.attributes["im:id"]),
    title: entry["im:name"].label,
    author: entry["im:artist"].label,
    coverUrl: entry["im:image"][2].label,
  }));
}

export async function searchPodcasts(query: string): Promise<Podcast[]> {
  const targetUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=podcast&limit=30`;
  const response = await fetch(wrapWithCorsProxy(targetUrl));
  const proxyData = await response.json();
  const data: iTunesSearchResponse = JSON.parse(proxyData.contents);

  return data.results.map((track) => ({
    id: track.collectionId,
    title: track.trackName,
    author: track.artistName,
    coverUrl: track.artworkUrl600,
  }));
}

export async function fetchPodcastDetails(
  podcastId: number,
  limit: number = 20,
): Promise<Episode[]> {
  const targetUrl = `https://itunes.apple.com/lookup?id=${podcastId}&media=podcast&entity=podcastEpisode&limit=${limit}`;
  const response = await fetch(wrapWithCorsProxy(targetUrl));
  const proxyData = await response.json();
  const data = JSON.parse(proxyData.contents);

  if (!data || !data.results || data.results.length <= 1) {
    console.warn(
      "No episodes found or invalid API response structure for podcast:",
      podcastId,
    );
    return [];
  }

  const rawEpisodes: iTunesEpisode[] = data.results.slice(1);

  return rawEpisodes.map((ep) => ({
    id: ep.trackId,
    title: ep.trackName,
    publishDate: formatDate(ep.releaseDate),
    duration: formatDuration(ep.trackTimeMillis),
    audioUrl: ep.episodeUrl,
  }));
}
