import {
  fetchBestPodcasts,
  searchPodcasts,
  fetchPodcastDetails,
} from "./api/podcast-api";
import { createPodcastCard } from "./components/podcast-card";
import { createPodcastDetailsPage } from "./components/podcast-details";
import { toggleLoader } from "./components/loader";
import { debounce } from "./utils/debounce";
import { Podcast, Episode } from "./types";
import { formatDuration } from "./utils/format";

let currentLimit = 20;
let lastSearchQuery = "";
let isShowingPlaylistPage = false;
let currentEpisodesInView: Episode[] = [];
let currentPodcastInView: Podcast | null = null;
let currentEpisodesLimit = 20;

const savedPlaylistRaw = localStorage.getItem("talestris_podcast_playlist");
let playlist: Episode[] = [];

try {
  const parsed = JSON.parse(savedPlaylistRaw || "[]");
  playlist = Array.isArray(parsed) ? parsed : [];
} catch {
  playlist = [];
}

const loadMoreBtn = document.querySelector("#load-more-btn") as HTMLElement;
const searchInput = document.querySelector("#search-input") as HTMLInputElement;
const searchWrapper = document.querySelector(
  ".search-wrapper",
) as HTMLDivElement;
const playlistToggleBtn = document.querySelector(
  "#playlist-toggle-btn",
) as HTMLButtonElement;
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

function getSavedEpisodeIds(): number[] {
  if (!Array.isArray(playlist)) {
    return [];
  }
  return playlist.map((ep) => ep.id);
}

function renderPodcasts(podcasts: Podcast[]) {
  if (podcasts.length === 0) {
    podcastContainer.innerHTML = "<p>No results</p>";
    return;
  }

  podcastContainer.innerHTML = podcasts
    .map((podcast) => createPodcastCard(podcast))
    .join("");
}

function renderPlaylistPage() {
  isShowingPlaylistPage = true;
  searchWrapper.style.display = "none";
  loadMoreBtn.style.display = "none";
  playlistToggleBtn.textContent = "Back to Browse";
  playlistToggleBtn.classList.add("active");

  if (playlist.length === 0) {
    podcastContainer.innerHTML =
      "<p style='text-align: center; width: 100%; padding: 2rem;'>Your Playlist is Empty 🤍</p>";
    return;
  }

  const episodesHtml = playlist
    .map(
      (ep) => `
  <div class="episode-item" data-audio-url="${ep.audioUrl}" data-title="${ep.title}" data-episode-id="${ep.id}">
    <div class="episode-info">
      <h4 class="episode-title">${ep.title}</h4>
      <span class="episode-date">${ep.publishDate}</span>
    </div>
    <div class="episode-actions">
      <span class="episode-duration">${ep.duration}</span>
      <button type="button" class="playlist-btn saved" data-id="${ep.id}">❤️ Remove</button>
    </div>
  </div>
`,
    )
    .join("");

  podcastContainer.innerHTML = `
    <div class="details-page" style="width: 100%;">
      <h3>My Playlist (${playlist.length})</h3>
      <div class="episodes-list">${episodesHtml}</div>
    </div>
  `;
}

async function loadApp(searchQuery: string = "") {
  isShowingPlaylistPage = false;
  playlistToggleBtn.textContent = "❤️ My Playlist";
  playlistToggleBtn.classList.remove("active");
  searchWrapper.style.display = "block";

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

async function loadPodcastDetails(podcast: Podcast, limit: number = 20) {
  isShowingPlaylistPage = false;
  currentPodcastInView = podcast;
  currentEpisodesLimit = limit;
  toggleLoader(true);

  searchWrapper.style.display = "none";
  loadMoreBtn.style.display = "none";

  try {
    const episodes = await fetchPodcastDetails(podcast.id, limit);
    currentEpisodesInView = episodes;

    podcastContainer.innerHTML = createPodcastDetailsPage(
      episodes,
      podcast,
      getSavedEpisodeIds(),
    );

    const episodesContainer = document.querySelector(".episodes-container");
    if (episodesContainer) {
      const moreEpBtn = document.createElement("button");
      moreEpBtn.type = "button";
      moreEpBtn.id = "load-more-episodes-btn";
      moreEpBtn.className = "load_more_btn";
      moreEpBtn.style.marginTop = "1rem";
      moreEpBtn.style.width = "100%";
      moreEpBtn.textContent = "Load more episodes...";

      if (episodes.length >= limit - 1) {
        episodesContainer.appendChild(moreEpBtn);

        moreEpBtn.addEventListener("click", () => {
          loadPodcastDetails(podcast, currentEpisodesLimit + 20);
        });
      }
    }

    const backBtn = document.querySelector("#back_btn") as HTMLButtonElement;
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        currentPodcastInView = null;
        /*searchWrapper.style.display = "block";*/
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
      /*searchWrapper.style.display = "block";*/
      loadApp(lastSearchQuery);
    });
  } finally {
    toggleLoader(false);
  }
}

function playEpisode(audioUrl: string, title: string, episodeId: string) {
  playerContainer.classList.remove("hidden");

  audioElement.setAttribute("data-current-ep-id", episodeId);
  audioElement.src = audioUrl;
  playerTitle.textContent = title;

  audioElement.play();
  playBtn.textContent = "⏸";

  localStorage.setItem("talestris_last_played_ep_id", episodeId);
  localStorage.setItem("talestris_last_played_url", audioUrl);
  localStorage.setItem("talestris_last_played_title", title);

  const savedTime = localStorage.getItem(`talestris_playback_pos_${episodeId}`);

  if (savedTime) {
    const resumeTime = Math.max(0, Number(savedTime) - 10);
    audioElement.currentTime = resumeTime;
  }
}

playlistToggleBtn.addEventListener("click", () => {
  if (isShowingPlaylistPage) {
    loadApp(lastSearchQuery);
  } else {
    renderPlaylistPage();
  }
});

const handleSearchInput = debounce((event: Event) => {
  const query = (event.target as HTMLInputElement).value;
  loadApp(query);
}, 400);

searchInput.addEventListener("input", handleSearchInput);

loadMoreBtn.addEventListener("click", () => {
  currentLimit += 20;
  loadApp();
});

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

  const currentEpId = audioElement.getAttribute("data-current-ep-id");
  if (currentEpId && current > 0) {
    localStorage.setItem(
      `talestris_playback_pos_${currentEpId}`,
      current.toString(),
    );
  }
});

progressBar.addEventListener("input", () => {
  const duration = audioElement.duration || 0;
  const newTime = (Number(progressBar.value) / 100) * duration;
  audioElement.currentTime = newTime;
});

podcastContainer.addEventListener("click", (event: Event) => {
  const target = event.target as HTMLElement;

  if (target.classList.contains("playlist-btn")) {
    event.stopPropagation();

    const epId = Number(target.getAttribute("data-id"));

    const isSaved = getSavedEpisodeIds().includes(epId);

    if (isSaved) {
      playlist = playlist.filter((ep) => ep.id !== epId);
    } else {
      const episodeObject =
        currentEpisodesInView.find((ep) => ep.id === epId) ||
        playlist.find((ep) => ep.id === epId);

      if (episodeObject) {
        playlist.push(episodeObject);
      }
    }
    localStorage.setItem(
      "talestris_podcast_playlist",
      JSON.stringify(playlist),
    );

    if (isShowingPlaylistPage) {
      renderPlaylistPage();
    } else if (currentPodcastInView) {
      podcastContainer.innerHTML = createPodcastDetailsPage(
        currentEpisodesInView,
        currentPodcastInView,
        getSavedEpisodeIds(),
      );
      const backBtn = document.querySelector("#back_btn") as HTMLButtonElement;
      backBtn?.addEventListener("click", () => {
        currentPodcastInView = null;
        loadApp(lastSearchQuery);
      });
    }
    return;
  }

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
    return;
  }

  const episodeItem = (target.closest(".episode-item") as HTMLElement) || null;

  if (episodeItem) {
    if (target.classList.contains("playlist-btn")) return;

    const audioUrl = episodeItem.getAttribute("data-audio-url");
    const title = episodeItem.getAttribute("data-title");
    const episodeId = episodeItem.getAttribute("data-episode-id");

    if (audioUrl && title && episodeId) {
      playEpisode(audioUrl, title, episodeId);
    }
  }
});

function restorePlayer() {
  const lastEpId = localStorage.getItem("talestris_last_played_ep_id");
  const lastUrl = localStorage.getItem("talestris_last_played_url");
  const lastTitle = localStorage.getItem("talestris_last_played_title");

  if (lastEpId && lastUrl && lastTitle) {
    playerContainer.classList.remove("hidden");
    audioElement.setAttribute("data-current-ep-id", lastEpId);
    audioElement.src = lastUrl;
    playerTitle.textContent = lastTitle;
    playBtn.textContent = "▶";

    const savedTime = localStorage.getItem(
      `talestris_playback_pos_${lastEpId}`,
    );

    if (savedTime) {
      audioElement.addEventListener(
        "loadedmetadata",
        () => {
          const resumeTime = Math.max(0, Number(savedTime) - 10);
          audioElement.currentTime = resumeTime;

          currentTimeLabel.textContent = formatDuration(resumeTime * 1000);
          const duration = audioElement.duration || 0;

          if (duration > 0) {
            totalTimeLabel.textContent = formatDuration(resumeTime * 1000);
            progressBar.value = ((resumeTime / duration) * 100).toString();
          }
        },
        { once: true },
      );
    }
  }
}

restorePlayer();

loadApp();
