(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function e(e){if(!e)return`00:00`;let t=Math.floor(e/1e3),n=Math.floor(t/3600),r=Math.floor(t%3600/60),i=t%60,a=e=>String(e).padStart(2,`0`);return n>0?`${n}:${a(r)}:${a(i)}`:`${a(r)}:${a(i)}`}function t(e){return e?new Date(e).toLocaleDateString(`en-US`,{year:`numeric`,month:`long`,day:`numeric`}):``}async function n(e=20){let t=`https://itunes.apple.com/us/rss/toppodcasts/limit=${e}/json`;return(await(await fetch(t)).json()).feed.entry.map(e=>({id:Number(e.id.attributes[`im:id`]),title:e[`im:name`].label,author:e[`im:artist`].label,coverUrl:e[`im:image`][2].label}))}async function r(e){return(await(await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(e)}&media=podcast&limit=30`)).json()).results.map(e=>({id:e.collectionId,title:e.trackName,author:e.artistName,coverUrl:e.artworkUrl600}))}async function i(n,r=20){let i=`https://itunes.apple.com/lookup?id=${n}&media=podcast&entity=podcastEpisode&limit=${r}`;return(await(await fetch(i)).json()).results.slice(1).map(n=>({id:n.trackId,title:n.trackName,publishDate:t(n.releaseDate),duration:e(n.trackTimeMillis),audioUrl:n.episodeUrl}))}function a(e,t){let n=t?`❤️`:`🤍`,r=t?`podcast-fav-btn active`:`podcast-fav-btn`;return`
    <div class="podcast-card" data-id="${e.id}">
      <div class="podcast-cover-wrapper">
        <img src="${e.coverUrl}" alt="${e.title}" class="podcast-cover">
        <button type="button" class="${r}" data-id="${e.id}">${n}</button>
      </div>
      <h3 class="podcast-title">${e.title}</h3>
      <p class="podcast-author">${e.author}</p>
    </div>
`}function o(e,t,n){let r=e.map(e=>{let t=n.includes(e.id),r=t?`❤️ Remove`:`🤍 Add to Playlist`,i=t?`playlist-btn saved`:`playlist-btn`;return`
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
`}function s(e){let t=document.querySelector(`#loader`);t&&(t.style.display=e?`block`:`none`)}function c(e,t){let n;return function(...r){clearTimeout(n),n=setTimeout(()=>e(...r),t)}}var l=20,u=``,d=!1,f=[],p=null,m=20,h=[];try{let e=localStorage.getItem(`talestris_favorite_podcasts`);h=Array.isArray(JSON.parse(e||`[]`))?JSON.parse(e||`[]`):[]}catch{h=[]}var g=localStorage.getItem(`talestris_podcast_playlist`),_=[];try{let e=JSON.parse(g||`[]`);_=Array.isArray(e)?e:[]}catch{_=[]}var v=document.querySelector(`#load-more-btn`),y=document.querySelector(`#search-input`),b=document.querySelector(`.search-wrapper`),x=document.querySelector(`#playlist-toggle-btn`),S=document.querySelector(`#podcast-list`),C=document.querySelector(`#audio-player-container`),w=document.querySelector(`#audio-element`),T=document.querySelector(`#play-btn`),E=document.querySelector(`#player-episode-title`),D=document.querySelector(`#player-current-time`),O=document.querySelector(`#player-total-time`),k=document.querySelector(`#player-progress-bar`),A=document.querySelector(`#search-clear-btn`),j=document.querySelector(`#player-close-btn`);function M(){return Array.isArray(_)?_.map(e=>e.id):[]}function N(e){if(e.length===0){S.innerHTML=`<p>No results</p>`;return}S.innerHTML=e.map(e=>a(e,h.some(t=>t.id===e.id))).join(``)}function P(){if(d=!0,b.style.display=`none`,v.style.display=`none`,x.textContent=`Back to Browse`,x.classList.add(`active`),_.length===0){S.innerHTML=`<p style='text-align: center; width: 100%; padding: 2rem;'>Your Playlist is Empty 🤍</p>`;return}let e=_.map(e=>`
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
`).join(``);S.innerHTML=`
    <div class="details-page" style="width: 100%;">
      <h3>My Playlist (${_.length})</h3>
      <div class="episodes-list">${e}</div>
    </div>
  `}async function F(e=``){d=!1,p=null,x.textContent=`❤️ My Playlist`,x.classList.remove(`active`),b.style.display=`block`,s(!0),u=e;try{let t;t=e.trim()===``?await n(l):await r(e),N(t),e.trim()===``?v.style.display=`block`:v.style.display=`none`}catch(e){console.error(`Failed to load data`,e),S.innerHTML=`<p>Oops, failed to load podcasts</p>`}finally{s(!1)}}async function I(e,t=20){d=!1,p=e,m=t,s(!0),b.style.display=`none`,v.style.display=`none`,localStorage.setItem(`talestris_last_saved_podcast`,JSON.stringify(e));try{let n=await i(e.id,t);f=n,S.innerHTML=o(n,e,M());let r=document.querySelector(`.episodes-container`);if(r){let i=document.createElement(`button`);i.type=`button`,i.id=`load-more-episodes-btn`,i.className=`load_more_btn`,i.style.marginTop=`1rem`,i.style.width=`100%`,i.textContent=`Load more episodes...`,n.length>=t-1&&(r.appendChild(i),i.addEventListener(`click`,()=>{I(e,m+20)}))}let a=document.querySelector(`#back_btn`);a&&a.addEventListener(`click`,()=>{p=null,F(u)})}catch(e){console.error(`Failed to load episodes`,e),S.innerHTML=`
      <p>Oops, failed to load episodes</p>
      <button id="back_btn" class="back-btn" type="button">← Back to podcasts</button>
    `,document.querySelector(`#back_btn`)?.addEventListener(`click`,()=>{F(u)})}finally{s(!1)}}function L(e,t,n){C.classList.remove(`hidden`),w.setAttribute(`data-current-ep-id`,n),w.src=e,E.textContent=t,w.play(),T.textContent=`⏸`,localStorage.setItem(`talestris_last_played_ep_id`,n),localStorage.setItem(`talestris_last_played_url`,e),localStorage.setItem(`talestris_last_played_title`,t),p&&localStorage.setItem(`talestris_podcast_playing`,JSON.stringify(p));let r=localStorage.getItem(`talestris_playback_pos_${n}`);r&&(w.currentTime=Math.max(0,Number(r)-10))}x.addEventListener(`click`,()=>{d?F(u):P()});var R=c(e=>{let t=e.target.value;F(t)},400);y.addEventListener(`input`,R),v.addEventListener(`click`,()=>{l+=20,F()}),E.addEventListener(`click`,()=>{let e=localStorage.getItem(`talestris_podcast_playing`);if(e)try{I(JSON.parse(e))}catch{console.error(`Failed to load podcast`)}}),T.addEventListener(`click`,()=>{w.paused?(w.play(),T.textContent=`⏸`):(w.pause(),T.textContent=`▶`)}),w.addEventListener(`timeupdate`,()=>{let t=w.currentTime,n=w.duration||0;D.textContent=e(t*1e3),O.textContent=e(n*1e3),n>0&&(k.value=(t/n*100).toString());let r=w.getAttribute(`data-current-ep-id`);r&&t>0&&localStorage.setItem(`talestris_playback_pos_${r}`,t.toString())}),w.addEventListener(`ended`,()=>{let e=Number(w.getAttribute(`data-current-ep-id`));if(!e)return;let t=d?_:f,n=t.findIndex(t=>t.id===e);if(n!==-1&&n<t.length-1){let e=t[n+1];e?L(e.audioUrl,e.title,e.id.toString()):T.textContent=`▶`}else T.textContent=`▶`,w.currentTime=0,k.value=`0`}),k.addEventListener(`input`,()=>{let e=w.duration||0;w.currentTime=Number(k.value)/100*e}),k.addEventListener(`mousedown`,()=>{}),k.addEventListener(`mouseup`,()=>{}),S.addEventListener(`click`,e=>{let t=e.target,n=t.closest(`.podcast-fav-btn`);if(n){e.stopPropagation();let t=Number(n.getAttribute(`data-id`)),r=n.closest(`.podcast-card`);if(!r)return;let i={id:t,title:r.querySelector(`.podcast-title`)?.textContent||``,author:r.querySelector(`.podcast-author`)?.textContent||``,coverUrl:r.querySelector(`.podcast-cover`)?.getAttribute(`src`)||``};h.some(e=>e.id===t)?(h=h.filter(e=>e.id!==t),n.textContent=`🤍`,n.classList.remove(`active`)):(h.push(i),n.textContent=`❤️`,n.classList.add(`active`)),localStorage.setItem(`talestris_favorite_podcasts`,JSON.stringify(h));return}if(t.classList.contains(`playlist-btn`)){e.stopPropagation();let n=Number(t.getAttribute(`data-id`));if(M().includes(n))_=_.filter(e=>e.id!==n);else{let e=f.find(e=>e.id===n)||_.find(e=>e.id===n);e&&_.push(e)}localStorage.setItem(`talestris_podcast_playlist`,JSON.stringify(_)),d?P():p&&(S.innerHTML=o(f,p,M()),document.querySelector(`#back_btn`)?.addEventListener(`click`,()=>{p=null,F(u)}));return}let r=t.closest(`.podcast-card`);if(r){let e=r.getAttribute(`data-id`),t=r.querySelector(`.podcast-title`)?.textContent||``,n=r.querySelector(`.podcast-author`)?.textContent||``,i=r.querySelector(`.podcast-cover`)?.getAttribute(`src`)||``;e&&I({id:Number(e),title:t,author:n,coverUrl:i});return}let i=t.closest(`.episode-item`)||null;if(i){if(t.classList.contains(`playlist-btn`))return;let e=i.getAttribute(`data-audio-url`),n=i.getAttribute(`data-title`),r=i.getAttribute(`data-episode-id`);e&&n&&r&&L(e,n,r)}});function z(){let t=localStorage.getItem(`talestris_last_played_ep_id`),n=localStorage.getItem(`talestris_last_played_url`),r=localStorage.getItem(`talestris_last_played_title`),i=localStorage.getItem(`talestris_podcast_playing`);if(i&&localStorage.setItem(`talestris_podcast_playing`,i),t&&n&&r){C.classList.remove(`hidden`),w.setAttribute(`data-current-ep-id`,t),w.src=n,E.textContent=r,T.textContent=`▶`;let i=localStorage.getItem(`talestris_playback_pos_${t}`);i&&w.addEventListener(`loadedmetadata`,()=>{let t=Math.max(0,Number(i)-10);w.currentTime=t,D.textContent=e(t*1e3);let n=w.duration||0;n>0&&(O.textContent=e(t*1e3),k.value=(t/n*100).toString())},{once:!0})}}y.addEventListener(`input`,()=>{y.value.trim()===``?A.classList.add(`hidden`):A.classList.remove(`hidden`)}),A.addEventListener(`click`,()=>{y.value=``,A.classList.add(`hidden`),F(``)}),j.addEventListener(`click`,()=>{w.pause(),T.textContent=`▶`,C.classList.add(`hidden`)}),z(),F();