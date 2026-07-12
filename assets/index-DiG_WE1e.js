(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function e(e){if(!e)return`00:00`;let t=Math.floor(e/1e3),n=Math.floor(t/3600),r=Math.floor(t%3600/60),i=t%60,a=e=>String(e).padStart(2,`0`);return n>0?`${n}:${a(r)}:${a(i)}`:`${a(r)}:${a(i)}`}function t(e){return e?new Date(e).toLocaleDateString(`en-US`,{year:`numeric`,month:`long`,day:`numeric`}):``}function n(e){return`https://allorigins.win{encodeURIComponent(url)}`}async function r(e=20){let t=`https://itunes.apple.com/us/rss/toppodcasts/limit=${e}/json`,r=await(await fetch(n(t))).json();return JSON.parse(r.contents).feed.entry.map(e=>({id:Number(e.id.attributes[`im:id`]),title:e[`im:name`].label,author:e[`im:artist`].label,coverUrl:e[`im:image`][2].label}))}async function i(e){let t=`https://itunes.apple.com/search?term=${encodeURIComponent(e)}&media=podcast&limit=30`,r=await(await fetch(n(t))).json();return JSON.parse(r.contents).results.map(e=>({id:e.collectionId,title:e.trackName,author:e.artistName,coverUrl:e.artworkUrl600}))}async function a(r,i=20){let a=`https://itunes.apple.com/lookup?id=${r}&media=podcast&entity=podcastEpisode&limit=${i}`,o=await(await fetch(n(a))).json();return JSON.parse(o.contents).results.slice(1).map(n=>({id:n.trackId,title:n.trackName,publishDate:t(n.releaseDate),duration:e(n.trackTimeMillis),audioUrl:n.episodeUrl}))}function o(e,t){let n=t?`❤️`:`🤍`,r=t?`podcast-fav-btn active`:`podcast-fav-btn`;return`
    <div class="podcast-card" data-id="${e.id}">
      <div class="podcast-cover-wrapper">
        <img src="${e.coverUrl}" alt="${e.title}" class="podcast-cover">
        <button type="button" class="${r}" data-id="${e.id}">${n}</button>
      </div>
      <h3 class="podcast-title">${e.title}</h3>
      <p class="podcast-author">${e.author}</p>
    </div>
`}function s(e,t,n){let r=e.map(e=>{let t=n.includes(e.id),r=t?`❤️ Remove`:`🤍 Add to Playlist`,i=t?`playlist-btn saved`:`playlist-btn`;return`
  <div class="episode-item" data-audio-url="${e.audioUrl}" data-title="${e.title}" data-episode-id="${e.id}">
    <div class="episode-info">
      <h4 class="episode-title">${e.title}</h4>
      <span class="episode-date">${e.publishDate}</span>
    </div>
    <div class="episode-actions">
      <span class="episode-duration">${e.duration}</span>
      <button type="button" class="${i}" data-id="${e.id}">${r}</button>
    </div>
  </div>
`}).join(``);return`
    <div class="details-page">
      <button id="back_btn" class="back-btn" type="button">← Back to podcasts</button>
      <div class="podcast-header-info">
        <img src="${t.coverUrl}" alt="${t.title}" class="details-cover">
        <div class="details-text">
          <h2>${t.title}</h2>
          <p class="details-author">By ${t.author}</p>
        </div>
      </div>
      <div class="episodes-container">
        <h3>Recent Episodes (${e.length})</h3>
        <div class="episodes-list">
          ${r}
        </div>
      </div>
    </div>
`}function c(e){let t=document.querySelector(`#loader`);t&&(t.style.display=e?`block`:`none`)}function l(e,t){let n;return function(...r){clearTimeout(n),n=setTimeout(()=>e(...r),t)}}var u=20,d=``,f=!1,p=[],m=null,h=20,g=[];try{let e=localStorage.getItem(`talestris_favorite_podcasts`);g=Array.isArray(JSON.parse(e||`[]`))?JSON.parse(e||`[]`):[]}catch{g=[]}var _=localStorage.getItem(`talestris_podcast_playlist`),v=[];try{let e=JSON.parse(_||`[]`);v=Array.isArray(e)?e:[]}catch{v=[]}var y=document.querySelector(`#load-more-btn`),b=document.querySelector(`#search-input`),x=document.querySelector(`.search-wrapper`),S=document.querySelector(`#playlist-toggle-btn`),C=document.querySelector(`#podcast-list`),w=document.querySelector(`#audio-player-container`),T=document.querySelector(`#audio-element`),E=document.querySelector(`#play-btn`),D=document.querySelector(`#player-episode-title`),O=document.querySelector(`#player-current-time`),k=document.querySelector(`#player-total-time`),A=document.querySelector(`#player-progress-bar`),j=document.querySelector(`#search-clear-btn`),M=document.querySelector(`#player-close-btn`);function N(){return Array.isArray(v)?v.map(e=>e.id):[]}function P(e){if(e.length===0){C.innerHTML=`<p>No results</p>`;return}C.innerHTML=e.map(e=>o(e,g.some(t=>t.id===e.id))).join(``)}function F(){if(f=!0,x.style.display=`none`,y.style.display=`none`,S.textContent=`Back to Browse`,S.classList.add(`active`),v.length===0){C.innerHTML=`<p style='text-align: center; width: 100%; padding: 2rem;'>Your Playlist is Empty 🤍</p>`;return}let e=v.map(e=>`
  <div class="episode-item" data-audio-url="${e.audioUrl}" data-title="${e.title}" data-episode-id="${e.id}">
    <div class="episode-info">
      <h4 class="episode-title">${e.title}</h4>
      <span class="episode-date">${e.publishDate}</span>
    </div>
    <div class="episode-actions">
      <span class="episode-duration">${e.duration}</span>
      <button type="button" class="playlist-btn saved" data-id="${e.id}">❤️ Remove</button>
    </div>
  </div>
`).join(``);C.innerHTML=`
    <div class="details-page" style="width: 100%;">
      <h3>My Playlist (${v.length})</h3>
      <div class="episodes-list">${e}</div>
    </div>
  `}async function I(e=``){f=!1,m=null,S.textContent=`❤️ My Playlist`,S.classList.remove(`active`),x.style.display=`block`,c(!0),d=e;try{let t;t=e.trim()===``?await r(u):await i(e),P(t),e.trim()===``?y.style.display=`block`:y.style.display=`none`}catch(e){console.error(`Failed to load data`,e),C.innerHTML=`<p>Oops, failed to load podcasts</p>`}finally{c(!1)}}async function L(e,t=20){f=!1,m=e,h=t,c(!0),x.style.display=`none`,y.style.display=`none`,localStorage.setItem(`talestris_last_saved_podcast`,JSON.stringify(e));try{let n=await a(e.id,t);p=n,C.innerHTML=s(n,e,N());let r=document.querySelector(`.episodes-container`);if(r){let i=document.createElement(`button`);i.type=`button`,i.id=`load-more-episodes-btn`,i.className=`load_more_btn`,i.style.marginTop=`1rem`,i.style.width=`100%`,i.textContent=`Load more episodes...`,n.length>=t-1&&(r.appendChild(i),i.addEventListener(`click`,()=>{L(e,h+20)}))}let i=document.querySelector(`#back_btn`);i&&i.addEventListener(`click`,()=>{m=null,I(d)})}catch(e){console.error(`Failed to load episodes`,e),C.innerHTML=`
      <p>Oops, failed to load episodes</p>
      <button id="back_btn" class="back-btn" type="button">← Back to podcasts</button>
    `,document.querySelector(`#back_btn`)?.addEventListener(`click`,()=>{I(d)})}finally{c(!1)}}function R(e,t,n){w.classList.remove(`hidden`),T.setAttribute(`data-current-ep-id`,n),T.src=e,D.textContent=t,T.play(),E.textContent=`⏸`,localStorage.setItem(`talestris_last_played_ep_id`,n),localStorage.setItem(`talestris_last_played_url`,e),localStorage.setItem(`talestris_last_played_title`,t),m&&localStorage.setItem(`talestris_podcast_playing`,JSON.stringify(m));let r=localStorage.getItem(`talestris_playback_pos_${n}`);r&&(T.currentTime=Math.max(0,Number(r)-10))}S.addEventListener(`click`,()=>{f?I(d):F()});var z=l(e=>{let t=e.target.value;I(t)},400);b.addEventListener(`input`,z),y.addEventListener(`click`,()=>{u+=20,I()}),D.addEventListener(`click`,()=>{let e=localStorage.getItem(`talestris_podcast_playing`);if(e)try{L(JSON.parse(e))}catch{console.error(`Failed to load podcast`)}}),E.addEventListener(`click`,()=>{T.paused?(T.play(),E.textContent=`⏸`):(T.pause(),E.textContent=`▶`)}),T.addEventListener(`timeupdate`,()=>{let t=T.currentTime,n=T.duration||0;O.textContent=e(t*1e3),k.textContent=e(n*1e3),n>0&&(A.value=(t/n*100).toString());let r=T.getAttribute(`data-current-ep-id`);r&&t>0&&localStorage.setItem(`talestris_playback_pos_${r}`,t.toString())}),T.addEventListener(`ended`,()=>{let e=Number(T.getAttribute(`data-current-ep-id`));if(!e)return;let t=f?v:p,n=t.findIndex(t=>t.id===e);if(n!==-1&&n<t.length-1){let e=t[n+1];e?R(e.audioUrl,e.title,e.id.toString()):E.textContent=`▶`}else E.textContent=`▶`,T.currentTime=0,A.value=`0`}),A.addEventListener(`input`,()=>{let e=T.duration||0;T.currentTime=Number(A.value)/100*e}),A.addEventListener(`mousedown`,()=>{}),A.addEventListener(`mouseup`,()=>{}),C.addEventListener(`click`,e=>{let t=e.target,n=t.closest(`.podcast-fav-btn`);if(n){e.stopPropagation();let t=Number(n.getAttribute(`data-id`)),r=n.closest(`.podcast-card`);if(!r)return;let i={id:t,title:r.querySelector(`.podcast-title`)?.textContent||``,author:r.querySelector(`.podcast-author`)?.textContent||``,coverUrl:r.querySelector(`.podcast-cover`)?.getAttribute(`src`)||``};g.some(e=>e.id===t)?(g=g.filter(e=>e.id!==t),n.textContent=`🤍`,n.classList.remove(`active`)):(g.push(i),n.textContent=`❤️`,n.classList.add(`active`)),localStorage.setItem(`talestris_favorite_podcasts`,JSON.stringify(g));return}if(t.classList.contains(`playlist-btn`)){e.stopPropagation();let n=Number(t.getAttribute(`data-id`));if(N().includes(n))v=v.filter(e=>e.id!==n);else{let e=p.find(e=>e.id===n)||v.find(e=>e.id===n);e&&v.push(e)}localStorage.setItem(`talestris_podcast_playlist`,JSON.stringify(v)),f?F():m&&(C.innerHTML=s(p,m,N()),document.querySelector(`#back_btn`)?.addEventListener(`click`,()=>{m=null,I(d)}));return}let r=t.closest(`.podcast-card`);if(r){let e=r.getAttribute(`data-id`),t=r.querySelector(`.podcast-title`)?.textContent||``,n=r.querySelector(`.podcast-author`)?.textContent||``,i=r.querySelector(`.podcast-cover`)?.getAttribute(`src`)||``;e&&L({id:Number(e),title:t,author:n,coverUrl:i});return}let i=t.closest(`.episode-item`)||null;if(i){if(t.classList.contains(`playlist-btn`))return;let e=i.getAttribute(`data-audio-url`),n=i.getAttribute(`data-title`),r=i.getAttribute(`data-episode-id`);e&&n&&r&&R(e,n,r)}});function B(){let t=localStorage.getItem(`talestris_last_played_ep_id`),n=localStorage.getItem(`talestris_last_played_url`),r=localStorage.getItem(`talestris_last_played_title`),i=localStorage.getItem(`talestris_podcast_playing`);if(i&&localStorage.setItem(`talestris_podcast_playing`,i),t&&n&&r){w.classList.remove(`hidden`),T.setAttribute(`data-current-ep-id`,t),T.src=n,D.textContent=r,E.textContent=`▶`;let i=localStorage.getItem(`talestris_playback_pos_${t}`);i&&T.addEventListener(`loadedmetadata`,()=>{let t=Math.max(0,Number(i)-10);T.currentTime=t,O.textContent=e(t*1e3);let n=T.duration||0;n>0&&(k.textContent=e(t*1e3),A.value=(t/n*100).toString())},{once:!0})}}b.addEventListener(`input`,()=>{b.value.trim()===``?j.classList.add(`hidden`):j.classList.remove(`hidden`)}),j.addEventListener(`click`,()=>{b.value=``,j.classList.add(`hidden`),I(``)}),M.addEventListener(`click`,()=>{T.pause(),E.textContent=`▶`,w.classList.add(`hidden`)}),B(),I();