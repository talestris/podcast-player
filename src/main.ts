import { fetchBestPodcasts, searchPodcasts } from "./api/podcast-api";
import { createPodcastCard } from "./components/podcast-card";
import { toggleLoader } from "./components/loader";
import { debounce } from "./utils/debounce";
import { Podcast } from "./types";

const searchInput = document.querySelector("#search-input") as HTMLInputElement;
const podcastContainer = document.querySelector(
  "#podcast-list",
) as HTMLDivElement;

function renderPodcasts(podcasts: Podcast[]) {
  if (podcasts.length === 0) {
    podcastContainer.innerHTML = "<p>No results</p>";
    return;
  }

  podcastContainer.innerHTML = podcasts
    .map((podcast) => createPodcastCard(podcast))
    .join("");
}

async function loadApp(searchQuery: string = "") {
  toggleLoader(true);

  try {
    let podcasts: Podcast[];

    if (searchQuery.trim() === "") {
      podcasts = await fetchBestPodcasts();
    } else {
      podcasts = await searchPodcasts(searchQuery);
    }

    renderPodcasts(podcasts);
  } catch (error) {
    console.error("Failed to load data", error);
    podcastContainer.innerHTML = "<p>Oops, failed to load podcasts</p>";
  } finally {
    toggleLoader(false);
  }
}

const handleSearchInput = debounce((event: Event) => {
  const query = (event.target as HTMLInputElement).value;
  loadApp(query);
}, 400);

searchInput.addEventListener("input", handleSearchInput);
loadApp();
