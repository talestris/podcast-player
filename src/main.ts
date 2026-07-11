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
import { formatDuration } from "./utils/format";

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

const playerContainer = document.querySelector(
  "#audio-player-container",
) as HTMLDivElement;
const audioElement = document.querySelector(
  "#audio-element",
) as HTMLAudioElement;
const playBtn = document.querySelector("#play-btn") as HTMLButtonElement;
const playerTitle = document.querySelector(
  "#player-episode-title",
) as HTMLDivElement;
const currentTimeLabel = document.querySelector(
  "#player-current-time",
) as HTMLSpanElement;
const totalTimeLabel = document.querySelector(
  "#player-total-time",
) as HTMLSpanElement;
const progressBar = document.querySelector(
  "#player-progress-bar",
) as HTMLInputElement;

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

async function loadPodcastDetails(podcast: Podcast) {
  toggleLoader(true);

  searchWrapper.style.display = "none";
  loadMoreBtn.style.display = "none";

  try {
    const episodes = await fetchPodcastDetails(podcast.id);
    podcastContainer.innerHTML = createPodcastDetailsPage(episodes, podcast);

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

function playEpisode(audioUrl: string, title: string) {
  playerContainer.classList.remove("hidden");
  audioElement.src = audioUrl;
  playerTitle.textContent = title;

  audioElement.play();
  playBtn.textContent = "⏸";
}

playBtn.addEventListener("click", () => {
  if (audioElement.paused) {
    audioElement.play();
    playBtn.textContent = "⏸";
  } else {
    audioElement.pause();
    playBtn.textContent = "▶";
  }
});

audioElement.addEventListener("timeupdate", () => {
  const current = audioElement.currentTime;
  const duration = audioElement.duration || 0;

  currentTimeLabel.textContent = formatDuration(current * 1000);
  totalTimeLabel.textContent = formatDuration(duration * 1000);

  if (duration > 0) {
    progressBar.value = ((current / duration) * 100).toString();
  }
});

progressBar.addEventListener("input", () => {
  const duration = audioElement.duration || 0;
  const newTime = (Number(progressBar.value) / 100) * duration;
  audioElement.currentTime = newTime;
});

podcastContainer.addEventListener("click", (event: Event) => {
  const target = event.target as HTMLElement;

  const card = target.closest(".podcast-card") as HTMLElement | null;

  if (card) {
    const podcastId = card.getAttribute("data-id");

    const title = card.querySelector(".podcast-title")?.textContent || "";
    const author = card.querySelector(".podcast-author")?.textContent || "";
    const coverUrl =
      card.querySelector(".podcast-cover")?.getAttribute("src") || "";

    if (podcastId) {
      const podcastData: Podcast = {
        id: Number(podcastId),
        title,
        author,
        coverUrl,
      };
      loadPodcastDetails(podcastData);
    }
  }

  const episodeItem = (target.closest(".episode-item") as HTMLElement) || null;

  if (episodeItem) {
    const audioUrl = episodeItem.getAttribute("data-audio-url");
    const title = episodeItem.getAttribute("data-title");

    if (audioUrl && title) {
      playEpisode(audioUrl, title);
    }
  }
});

loadApp();
