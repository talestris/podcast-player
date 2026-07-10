export interface Podcast {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
}

export interface iTunesSearchTrack {
  collectionId: number;
  trackName: string;
  artistName: string;
  artWorkUrl1600: string;
}

export interface iTunesSearchResponse {
  resultCount: number;
  results: iTunesSearchTrack[];
}
