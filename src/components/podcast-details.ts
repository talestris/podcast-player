import { Episode, Podcast } from "../types";

export function createPodcastDetailsPage(
  episodes: Episode[],
  podcast: Podcast,
  savedEpisodeIds: number[],
): string {
  const episodesHtml = episodes
    .map((ep) => {
      const isSaved = savedEpisodeIds.includes(ep.id);
      const btnText = isSaved ? "❤️ Remove" : "🤍 Add to Playlist";
      const btnClass = isSaved ? "playlist-btn saved" : "playlist-btn";

      return `
  <div class="episode-item" data-audio-url="${ep.audioUrl}" data-title="${ep.title}" data-episode-id="${ep.id}">
    <div class="episode-info">
      <h4 class="episode-title">${ep.title}</h4>
      <span class="episode-date">${ep.publishDate}</span>
    </div>
    <div class="episode-actions">
      <span class="episode-duration">${ep.duration}</span>
      <button type="button" class="${btnClass}" data-id="${ep.id}">${btnText}</button>
    </div>
  </div>
`;
    })
    .join("");

  return `
    <div class="details-page">
      <button id="back_btn" class="back-btn" type="button">← Back to podcasts</button>
      <div class="podcast-header-info">
        <img src="${podcast.coverUrl}" alt="${podcast.title}" class="details-cover">
        <div class="details-text">
          <h2>${podcast.title}</h2>
          <p class="details-author">By ${podcast.author}</p>
        </div>
      </div>
      <div class="episodes-container">
        <h3>Recent Episodes (${episodes.length})</h3>
        <div class="episodes-list">
          ${episodesHtml}
        </div>
      </div>
    </div>
`;
}
