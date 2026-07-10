import { Podcast, iTunesSearchResponse } from "../types";

export async function fetchBestPodcasts(): Promise<Podcast[]> {
  const response = await fetch("https://apple.com");
  const data = await response.json();

  return data.feed.entry.map((entry: any) => ({
    id: Number(entry.id.attributes["im:id"]),
    title: entry["im:name"].label,
    author: entry["im:artist"].label,
    coverUrl: entry["im:image"][2].label,
  }));
}
