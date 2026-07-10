import { Podcast } from "../types";

export function createPodcastCard(podcast: Podcast): string {
  return `
    <div class="podcast-card" data-id="${podcast.id}">
      <img src="${podcast.coverUrl}" alt="${podcast.title}" class="podcast-cover">
      <h3 class="podcast-title">${podcast.title}</h3>
      <p class="podcast-author">${podcast.author}</p>
    </div>
`;
}
