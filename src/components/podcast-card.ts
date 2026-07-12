import { Podcast } from "../types";

export function createPodcastCard(
  podcast: Podcast,
  isFavorite: boolean,
): string {
  const btnText = isFavorite ? "❤️" : "🤍";
  const btnClass = isFavorite ? "podcast-fav-btn active" : "podcast-fav-btn";
  return `
    <div class="podcast-card" data-id="${podcast.id}">
      <div class="podcast-cover-wrapper">
        <img src="${podcast.coverUrl}" alt="${podcast.title}" class="podcast-cover">
        <button type="button" class="${btnClass}" data-id="${podcast.id}">${btnText}</button>
      </div>
      <h3 class="podcast-title">${podcast.title}</h3>
      <p class="podcast-author">${podcast.author}</p>
    </div>
`;
}
