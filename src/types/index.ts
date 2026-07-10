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
