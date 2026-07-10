import { Podcast, iTunesSearchResponse } from "../types";

export async function fetchBestPodcasts(): Promise<Podcast[]> {
  const url =
    "https://applemarketingtools.com{us}/podcasts/top/{25}/podcasts.json";
  const response = await fetch(url);
  const data = await response.json();

  return data.feed.entry.map((entry: any) => ({
    id: Number(entry.id.attributes["im:id"]),
    title: entry["im:name"].label,
    author: entry["im:artist"].label,
    coverUrl: entry["im:image"][2].label,
  }));
}

export async function searchPodcasts(query: string): Promise<Podcast[]> {
  const response = await fetch(
    `https://apple.com${encodeURIComponent(query)}&media=podcast&limit=30`,
  );
  const data: iTunesSearchResponse = await response.json();

  return data.results.map((track) => ({
    id: track.collectionId,
    title: track.trackName,
    author: track.artistName,
    coverUrl: track.artworkUrl600,
  }));
}
