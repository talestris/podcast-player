export interface Podcast {
  id: number;
  title: string;
  author: string;
  coverUrl: string;
}

export interface iTunesSearchTrack {
  collectionId: number;
  trackName: string;
  artistName: string;
  artworkUrl600: string;
}

export interface iTunesSearchResponse {
  resultCount: number;
  results: iTunesSearchTrack[];
}

export interface Episode {
  id: number;
  title: string;
  publishDate: string;
  duration: string;
  audioUrl: string;
}

export interface iTunesEpisode {
  trackId: number;
  trackName: string;
  releaseDate: string;
  trackTimeMillis: number;
  episodeUrl: string;
}
