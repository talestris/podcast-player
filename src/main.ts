import {
  fetchBestPodcasts,
  searchPodcasts,
  fetchPodcastDetails,
} from "./api/podcast-api";
import { createPodcastCard } from "./components/podcast-card";
import { createPodcastDetailsPage } from "./components/podcast-details";
import { toggleLoader } from "./components/loader";
import { debounce } from "./utils/debounce";
import { Podcast } from "./types";

let currentLimit = 20;
let lastSearchQuery = "";

const loadMoreBtn = document.querySelector("#load-more-btn") as HTMLElement;
const searchInput = document.querySelector("#search-input") as HTMLInputElement;
const searchWrapper = document.querySelector(
  ".search-wrapper",
) as HTMLDivElement;
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
  lastSearchQuery = searchQuery;

  try {
    let podcasts: Podcast[];

    if (searchQuery.trim() === "") {
      podcasts = await fetchBestPodcasts(currentLimit);
    } else {
      podcasts = await searchPodcasts(searchQuery);
    }
    renderPodcasts(podcasts);

    if (searchQuery.trim() === "") {
      loadMoreBtn.style.display = "block";
    } else {
      loadMoreBtn.style.display = "none";
    }
  } catch (error) {
    console.error("Failed to load data", error);
    podcastContainer.innerHTML = "<p>Oops, failed to load podcasts</p>";
  } finally {
    toggleLoader(false);
  }
}

async function loadPodcastDetails(podcastId: number) {
  toggleLoader(true);

  searchWrapper.style.display = "none";
  loadMoreBtn.style.display = "none";

  try {
    const episodes = await fetchPodcastDetails(podcastId);
    podcastContainer.innerHTML = createPodcastDetailsPage(episodes);

    const backBtn = document.querySelector("#back_btn") as HTMLButtonElement;
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        searchWrapper.style.display = "block";
        loadApp(lastSearchQuery);
      });
    }
  } catch (error) {
    console.error("Failed to load episodes", error);
    podcastContainer.innerHTML = `
      <p>Oops, failed to load episodes</p>
      <button id="back_btn" class="back-btn" type="button">← Back to podcasts</button>
    `;
    const backBtn = document.querySelector("#back_btn") as HTMLButtonElement;
    backBtn?.addEventListener("click", () => {
      searchWrapper.style.display = "block";
      loadApp(lastSearchQuery);
    });
  } finally {
    toggleLoader(false);
  }
}

const handleSearchInput = debounce((event: Event) => {
  const query = (event.target as HTMLInputElement).value;
  loadApp(query);
}, 400);

searchInput.addEventListener("input", handleSearchInput);

loadMoreBtn.addEventListener("click", () => {
  currentLimit += 20;
  loadApp();
});

podcastContainer.addEventListener("click", (event: Event) => {
  const target = event.target as HTMLElement;
  const card = target.closest(".podcast-card") as HTMLElement | null;

  if (card) {
    const podcastId = card.getAttribute("data-id");
    if (podcastId) {
      loadPodcastDetails(Number(podcastId));
    }
  }
});

loadApp();
