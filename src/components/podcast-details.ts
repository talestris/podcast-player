import { Episode } from "../types";

export function createPodcastDetailsPage(episodes: Episode[]): string {
  const episodesHtml = episodes
    .map(
      (ep) => `
  <div class="episode-item" data-episode-id="${ep.id}">
    <div class="episode-info">
      <h4 class="episode-title">${ep.title}</h4>
      <span class="episode-date">${ep.publishDate}</span>
    </div>
    <span class="episode-duration">${ep.duration}</span>
  </div>
`,
    )
    .join("");

  return `
    <div class="details-page">
      <button id="back_btn" class="back-btn" type="button">← Back to podcasts</button>
      <div class="episodes-container">
        <h3>Recent Episodes (${episodes.length})</h3>
        <div class="episodes-list">
          ${episodesHtml}
        </div>
      </div>
    </div>
`;
}
