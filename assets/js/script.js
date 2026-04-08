'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
//  const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}


let heroSwiper = null;                   // keeps reference between opens

// ── Video prefetch cache ───────────────────────────────────────────────────
// Keys are video src strings; values are hidden <video> elements that have
// already started fetching metadata, so modal open is instant.
const videoPreloadCache = new Map();

function prefetchVideoMetadata(src) {
  if (videoPreloadCache.has(src)) return;
  const v = document.createElement('video');
  v.preload = 'metadata';
  v.playsInline = true;
  v.style.cssText = 'position:absolute;width:0;height:0;opacity:0;pointer-events:none';
  v.src = src;
  document.body.appendChild(v);
  videoPreloadCache.set(src, v);
}

function prefetchCardVideos(card) {
  const raw = card.dataset.gallery;
  if (!raw) return;
  try {
    const gallery = JSON.parse(raw);
    for (const entry of gallery) {
      const src = typeof entry === 'string' ? entry : entry.src;
      if (/\.(mp4|webm|ogg)$/i.test(src)) {
        prefetchVideoMetadata(src);
        break; // only the first video per card — enough to warm up the most likely one
      }
    }
  } catch (_) {}
}

// Watch project cards — prefetch as they scroll into view
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      prefetchCardVideos(entry.target);
      cardObserver.unobserve(entry.target); // only need to prefetch once
    }
  });
}, { rootMargin: '200px' }); // start 200px before the card is visible

document.querySelectorAll('.project-item').forEach(card => cardObserver.observe(card));

function buildHeroSwiper(slideSrcArray){
  const wrapper = document.querySelector('#heroSwiper .swiper-wrapper');
  wrapper.innerHTML = '';                // clear previous slides

  // Videos always first
  const isVideoSrc = s => /\.(mp4|webm|ogg)$/i.test(typeof s === 'string' ? s : s.src);
  const sorted = [...slideSrcArray].sort((a, b) => isVideoSrc(b) - isVideoSrc(a));

  sorted.forEach(entry => {
    // Entry can be a plain string or { src, fit }
    // fit: "full"  → constrain to container in both axes (no cropping)
    // fit: "cover" → (default) fill width, height auto
    const src = typeof entry === 'string' ? entry : entry.src;
    const fit = typeof entry === 'object' && entry.fit ? entry.fit : 'cover';

    const slide  = document.createElement('div');
    slide.className = 'swiper-slide';
    if (fit === 'full') slide.classList.add('slide-fit-full');

    const isVideo = /\.(mp4|webm|ogg)$/i.test(src);
    let media;
    if (isVideo) {
      // Reuse a pre-fetched element if available, otherwise create fresh
      const cached = videoPreloadCache.get(src);
      if (cached) {
        cached.removeAttribute('style'); // unhide
        cached.controls = true;
        cached.muted = true;
        cached.autoplay = true;
        media = cached;
        videoPreloadCache.delete(src);   // it's now in the DOM; don't reuse again
      } else {
        media = document.createElement('video');
        media.muted = true;          // must be set before src to guarantee muted autoplay
        media.setAttribute('muted', '');
        media.src = src;
        media.controls = true;
        media.playsInline = true;
        media.preload = 'metadata';
        media.autoplay = true;
      }
    } else {
      media = Object.assign(new Image(), { src, alt: 'project asset', loading: 'lazy' });
    }

    slide.appendChild(media);
    wrapper.appendChild(slide);
  });

  // re-initialise (destroys old instance to avoid duplicates)
  if (heroSwiper) heroSwiper.destroy(true, true);

  heroSwiper = new Swiper('#heroSwiper', {
    loop:        sorted.length > 3,
    speed:       600,
    grabCursor:  true,
    keyboard:    { enabled:true },
    navigation:  { nextEl: '#heroSwiper-next', prevEl: '#heroSwiper-prev' },
    pagination:  { el: '.swiper-pagination', clickable:true },
    on: {
      slideChange() {
        wrapper.querySelectorAll('video').forEach(v => v.pause());
      }
    }
  });
}


// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
//modalCloseBtn.addEventListener("click", testimonialsModalFunc);
//overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

let filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

let messagesSent = 0;

// Mark a field as touched on blur so persistent :invalid styling activates
formInputs.forEach(input => {
  input.addEventListener("blur", () => input.classList.add("touched"));

  // Update button label on any input change
  input.addEventListener("input", () => {
    formBtn.querySelector("span").textContent = messagesSent > 0
      ? "Two messages? I'm flattered."
      : "Send Message";
  });
});

function wobbleInvalid() {
  formInputs.forEach(input => {
    if (!input.checkValidity()) {
      input.classList.add("touched");
      input.classList.remove("wobble");
      void input.offsetWidth; // force reflow so animation restarts
      input.classList.add("wobble");
      input.addEventListener("animationend", () => input.classList.remove("wobble"), { once: true });
    }
  });
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  // If anything's invalid, show errors and bail
  if (!form.checkValidity()) {
    wobbleInvalid();
    return;
  }

  formBtn.setAttribute("disabled", "");
  formBtn.querySelector("span").textContent = "Sending…";

  try {
    const res = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    });

    if (res.ok) {
      messagesSent++;
      formBtn.querySelector("span").textContent = "Sent!";
      form.reset();
      formInputs.forEach(input => input.classList.remove("touched"));
      form.dispatchEvent(new CustomEvent('formResult', { detail: { status: 'success' } }));
    } else {
      formBtn.querySelector("span").textContent = "Error — try again";
      formBtn.removeAttribute("disabled");
      form.dispatchEvent(new CustomEvent('formResult', { detail: { status: 'error' } }));
    }
  } catch {
    formBtn.querySelector("span").textContent = "Error — try again";
    formBtn.removeAttribute("disabled");
    form.dispatchEvent(new CustomEvent('formResult', { detail: { status: 'error' } }));
  }
});


// ── Social link "shot" easter egg ────────────────────────────────────────────
// Four distinct bullet hole designs — tight dark circles, asymmetric cracks
const _holeVariants = [
  // 1 — clean punch-through: small circle, 4 tight cracks
  `<circle cx="12" cy="12" r="2" fill="#050302"/>
   <circle cx="12" cy="12" r="2.7" fill="none" stroke="rgba(255,200,120,0.18)" stroke-width="1.1"/>
   <line x1="13.8" y1="10.2" x2="21"  y2="3"   stroke="rgba(255,255,255,0.68)" stroke-width="1.4" stroke-linecap="round"/>
   <line x1="10.2" y1="10.2" x2="3.5" y2="4"   stroke="rgba(255,255,255,0.6)"  stroke-width="1.3" stroke-linecap="round"/>
   <line x1="11.5" y1="14"   x2="10"  y2="22.5" stroke="rgba(255,255,255,0.55)" stroke-width="1.2" stroke-linecap="round"/>
   <line x1="14.2" y1="12.8" x2="22.5" y2="14.5" stroke="rgba(255,255,255,0.42)" stroke-width="1"  stroke-linecap="round"/>`,

  // 2 — ricochet: tiny circle, 3 long wild cracks
  `<circle cx="11.5" cy="12.5" r="1.6" fill="#040301"/>
   <circle cx="11.5" cy="12.5" r="2.2" fill="none" stroke="rgba(255,180,80,0.15)" stroke-width="1"/>
   <line x1="13.2" y1="11"   x2="23"  y2="1.5" stroke="rgba(255,255,255,0.72)" stroke-width="1.5" stroke-linecap="round"/>
   <line x1="17.5" y1="5.5"  x2="23"  y2="9"   stroke="rgba(255,255,255,0.35)" stroke-width="0.8" stroke-linecap="round"/>
   <line x1="10.5" y1="14.2" x2="6"   y2="23"  stroke="rgba(255,255,255,0.6)"  stroke-width="1.3" stroke-linecap="round"/>
   <line x1="10"   y1="11"   x2="2"   y2="6"   stroke="rgba(255,255,255,0.5)"  stroke-width="1.1" stroke-linecap="round"/>`,

  // 3 — heavy round: larger hole, spiderweb of shorter cracks
  `<circle cx="12" cy="12" r="2.6" fill="#060403"/>
   <circle cx="12" cy="12" r="3.3" fill="none" stroke="rgba(255,210,140,0.2)" stroke-width="1.4"/>
   <line x1="14"   y1="9.5"  x2="19.5" y2="4.5" stroke="rgba(255,255,255,0.65)" stroke-width="1.3" stroke-linecap="round"/>
   <line x1="10"   y1="9.5"  x2="5"    y2="5"   stroke="rgba(255,255,255,0.6)"  stroke-width="1.2" stroke-linecap="round"/>
   <line x1="14.5" y1="13"   x2="21"   y2="15"  stroke="rgba(255,255,255,0.5)"  stroke-width="1.1" stroke-linecap="round"/>
   <line x1="11"   y1="14.5" x2="9"    y2="21"  stroke="rgba(255,255,255,0.55)" stroke-width="1.2" stroke-linecap="round"/>
   <line x1="9.5"  y1="13"   x2="3"    y2="18"  stroke="rgba(255,255,255,0.45)" stroke-width="1"  stroke-linecap="round"/>`,

  // 4 — graze: off-centre tiny hole, two long parallel cracks
  `<circle cx="13" cy="11.5" r="1.7" fill="#050302"/>
   <circle cx="13" cy="11.5" r="2.3" fill="none" stroke="rgba(255,190,100,0.16)" stroke-width="1"/>
   <line x1="14.5" y1="9.8"  x2="23"  y2="2"   stroke="rgba(255,255,255,0.7)"  stroke-width="1.5" stroke-linecap="round"/>
   <line x1="19"   y1="5.5"  x2="23"  y2="10"  stroke="rgba(255,255,255,0.38)" stroke-width="0.9" stroke-linecap="round"/>
   <line x1="11"   y1="9.5"  x2="3"   y2="3.5" stroke="rgba(255,255,255,0.62)" stroke-width="1.3" stroke-linecap="round"/>
   <line x1="12"   y1="13.5" x2="8.5" y2="22"  stroke="rgba(255,255,255,0.52)" stroke-width="1.1" stroke-linecap="round"/>
   <line x1="14.5" y1="13.5" x2="21"  y2="19"  stroke="rgba(255,255,255,0.4)"  stroke-width="0.9" stroke-linecap="round"/>`,
];

// Track holes so we can reposition them on resize
const _shotHoles = [];
let _shotCount = 0;
window.addEventListener('resize', () => {
  const sr = document.querySelector('[data-sidebar]').getBoundingClientRect();
  _shotHoles.forEach(h => {
    h.el.style.left = (sr.left + h.ox) + 'px';
    h.el.style.top  = (sr.top  + h.oy) + 'px';
  });
});

document.querySelectorAll('.social-link').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    if (this.classList.contains('is-shot')) return;
    this.classList.add('is-shot');

    const ns  = 'http://www.w3.org/2000/svg';
    const cx  = e.clientX;
    const cy  = e.clientY;

    // Icon centre in viewport space
    const iconR = this.getBoundingClientRect();
    const icX   = iconR.left + iconR.width  / 2;
    const icY   = iconR.top  + iconR.height / 2;

    // Fly vector: click → icon centre, horizontal distance carries the impact direction
    // gravity handles the rest of the Y travel so we keep dy moderate
    let dx = icX - cx, dy = icY - cy;
    const mag = Math.sqrt(dx*dx + dy*dy) || 1;
    dx = (dx / mag) * 300;
    dy = (dy / mag) * 180; // gravity will dominate vertical

    const angD = Math.atan2(dy, dx) * 180 / Math.PI;
    const spin = dx >= 0 ? 720 : -720; // two full tumbles — feels heavy
    const G    = 210; // px of downward pull over the full animation

    // Gravity curve: position at time t
    const gx = t => dx * t;
    const gy = t => dy * t + G * t * t;

    // ① Impact burst — speed lines at exact cursor
    const burst = document.createElementNS(ns, 'svg');
    burst.style.cssText = `position:fixed;left:${cx}px;top:${cy}px;width:80px;height:80px;`
                        + `transform:translate(-50%,-50%);pointer-events:none;z-index:9999;overflow:visible;`;
    for (let a = 0; a < 8; a++) {
      const rad = (a / 8) * Math.PI * 2;
      const r1  = 7  + (a % 2) * 4;
      const r2  = 25 + (a % 3) * 10;
      const ln  = document.createElementNS(ns, 'line');
      ln.setAttribute('x1', String(40 + Math.cos(rad) * r1));
      ln.setAttribute('y1', String(40 + Math.sin(rad) * r1));
      ln.setAttribute('x2', String(40 + Math.cos(rad) * r2));
      ln.setAttribute('y2', String(40 + Math.sin(rad) * r2));
      ln.setAttribute('stroke',       a % 2 === 0 ? 'rgba(255,210,30,0.95)' : 'rgba(255,255,255,0.65)');
      ln.setAttribute('stroke-width', a % 2 === 0 ? '2.5' : '1.5');
      ln.setAttribute('stroke-linecap', 'round');
      burst.appendChild(ln);
    }
    document.body.appendChild(burst);
    burst.animate(
      [{ opacity:1, transform:'translate(-50%,-50%) scale(0.1)' },
       { opacity:0, transform:'translate(-50%,-50%) scale(1.6)' }],
      { duration:250, easing:'ease-out', fill:'forwards' }
    ).onfinish = () => burst.remove();

    // ② Icon — steel duck physics
    //    Impact squash (compressed in fly direction) → stretch (anticipation) →
    //    weighted parabolic fall with heavy tumble spin
    //
    //    Squash/stretch are direction-aligned:
    //      rotate(angD) puts X along fly direction
    //      scale(sx,sy) then operates in that frame
    //      rotate(-angD) rotates back
    //    SQUASH: thin along fly (sx=0.3), wide perpendicular (sy=1.7)
    //    STRETCH: long along fly (sx=1.7), thin perpendicular (sy=0.3)
    this.animate([
      { offset: 0,    opacity: 1,
        transform: `translate(0px,0px) rotate(0deg) scale(1,1)` },

      // brief recoil — push back from impact
      { offset: 0.05, opacity: 1,
        transform: `translate(${-dx*0.04}px,${-dy*0.04}px) rotate(0deg) scale(1.08,0.94)` },

      // squash: impact compression, aligned to fly direction
      { offset: 0.12, opacity: 1,
        transform: `translate(${dx*0.02}px,${dy*0.02}px)`
                 + ` rotate(${angD}deg) scale(0.3,1.7) rotate(${-angD}deg)` },

      // stretch: launch elongation along fly direction
      { offset: 0.22, opacity: 1,
        transform: `translate(${dx*0.01}px,${dy*0.01}px)`
                 + ` rotate(${angD}deg) scale(1.7,0.3) rotate(${-angD}deg)` },

      // in flight — gravity now owns the Y axis, tumbling with weight
      { offset: 0.36, opacity: 1,
        transform: `translate(${gx(0.36)}px,${gy(0.36)}px) rotate(${spin*0.36}deg) scale(1,1)` },

      { offset: 0.54, opacity: 0.95,
        transform: `translate(${gx(0.54)}px,${gy(0.54)}px) rotate(${spin*0.54}deg) scale(0.88,0.88)` },

      { offset: 0.70, opacity: 0.75,
        transform: `translate(${gx(0.70)}px,${gy(0.70)}px) rotate(${spin*0.70}deg) scale(0.62,0.62)` },

      { offset: 0.85, opacity: 0.35,
        transform: `translate(${gx(0.85)}px,${gy(0.85)}px) rotate(${spin*0.85}deg) scale(0.32,0.32)` },

      { offset: 1,    opacity: 0,
        transform: `translate(${gx(1)}px,${gy(1)}px) rotate(${spin}deg) scale(0,0)` },
    ], { duration: 850, easing: 'linear', fill: 'forwards' });

    // ③ Bullet hole — random variant, tight circle, fades after a beat
    const sidebar = document.querySelector('[data-sidebar]');
    const sr      = sidebar.getBoundingClientRect();
    const ox      = cx - sr.left;
    const oy      = cy - sr.top;

    const hole = document.createElementNS(ns, 'svg');
    hole.setAttribute('viewBox', '0 0 24 24');
    hole.style.cssText = `position:fixed;left:${cx}px;top:${cy}px;width:18px;height:18px;`
                       + `transform:translate(-50%,-50%) scale(0);pointer-events:none;z-index:9998;`;
    hole.innerHTML = _holeVariants[Math.floor(Math.random() * _holeVariants.length)];
    document.body.appendChild(hole);
    const holeRef = { el: hole, ox, oy };
    _shotHoles.push(holeRef);

    // Punch in with overshoot, then fade out after 2.5 s
    hole.animate(
      [{ transform:'translate(-50%,-50%) scale(0)' },
       { transform:'translate(-50%,-50%) scale(1.5)', offset:0.55 },
       { transform:'translate(-50%,-50%) scale(1)' }],
      { duration:210, delay:110, easing:'ease-out', fill:'forwards' }
    );
    setTimeout(() => {
      hole.animate(
        [{ opacity:1 }, { opacity:0 }],
        { duration:600, easing:'ease-in', fill:'forwards' }
      ).onfinish = () => {
        hole.remove();
        const i = _shotHoles.indexOf(holeRef);
        if (i !== -1) _shotHoles.splice(i, 1);
      };
    }, 2500);

    // All three shot — swap the avatar
    _shotCount++;
    if (_shotCount >= 3) {
      const avatarImg = document.querySelector('.avatar-box img');
      if (avatarImg && !avatarImg.dataset.shot) {
        avatarImg.dataset.shot = '1';
        setTimeout(() => {
          // Shake the avatar box
          const box = avatarImg.closest('.avatar-box');
          box.animate([
            { transform: 'translate(0,0) rotate(0deg)' },
            { transform: 'translate(-4px,-2px) rotate(-3deg)' },
            { transform: 'translate(4px, 2px) rotate( 3deg)' },
            { transform: 'translate(-3px, 3px) rotate(-2deg)' },
            { transform: 'translate(3px,-3px) rotate( 2deg)' },
            { transform: 'translate(-2px, 1px) rotate(-1deg)' },
            { transform: 'translate(0,0) rotate(0deg)' },
          ], { duration: 380, easing: 'ease-out' });

          // Flash white then reveal the new face
          setTimeout(() => {
            avatarImg.animate(
              [{ filter:'brightness(1)' }, { filter:'brightness(8)' }, { filter:'brightness(1)' }],
              { duration: 200, easing: 'ease-out', fill: 'forwards' }
            ).onfinish = () => {
              avatarImg.src = './assets/images/avatar_ben_shot.png';
              avatarImg.style.filter = '';
            };
          }, 300);
        }, 600); // slight delay after last shot lands
      }
    }

    // ④ Smoke from cursor, self-cleaning
    [-11, 6, 1, 12, -4].forEach((driftX, i) => {
      const puff = document.createElement('div');
      puff.classList.add('smoke-puff');
      puff.style.cssText = `position:fixed;`
                         + `left:${cx + (Math.random()-0.5)*8}px;`
                         + `top:${cy  + (Math.random()-0.5)*8}px;`;
      puff.style.setProperty('--dx', driftX + 'px');
      puff.style.animationDelay = (i * 0.065) + 's';
      document.body.appendChild(puff);
      setTimeout(() => puff.remove(), 1500);
    });
  });
});


// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);

      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

    // When navigating to Portfolio, kick off video prefetch for all cards
    // (IntersectionObserver can't see hidden sections until they become visible)
    if (this.innerHTML.trim().toLowerCase() === 'portfolio') {
      document.querySelectorAll('.project-item').forEach(prefetchCardVideos);
      // Recalculate masonry now that the section is visible — getBoundingClientRect
      // returns 0 for hidden elements so the DOM-ready call couldn't size correctly.
      // Two rAFs: first lets the browser paint the visible section, second measures.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          resizeAllMasonryItems();
          grid.classList.add('masonry-ready');
        });
      });
    }

  });
}

const portfolioBtn = [...document.querySelectorAll('[data-nav-link]')]
                     .find(b => b.textContent.trim().toLowerCase() === 'portfolio');

// Event delegation covers both original and cloned project items
document.addEventListener('click', e => {
  const link = e.target.closest('.clients-item a[data-scroll]');
  if (!link) return;
  e.preventDefault();

  const targetId = link.dataset.scroll;
  if (!targetId) return;

  portfolioBtn?.click();

  requestAnimationFrame(() => {
    document.getElementById(targetId)
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ── Infinite ticker ───────────────────────────────────────────────────────
document.querySelectorAll('.ticker-track').forEach(track => {
  // Duplicate all items for seamless loop (-50% animation works on 2× content)
  Array.from(track.children).forEach(item => {
    track.appendChild(item.cloneNode(true));
  });

  // Touch: pause while finger is down, resume on lift
  const wrap = track.closest('.ticker-wrap');
  wrap.addEventListener('touchstart', () => {
    track.style.animationPlayState = 'paused';
  }, { passive: true });
  wrap.addEventListener('touchend', () => {
    track.style.animationPlayState = '';
  }, { passive: true });
});



const projModal    = document.getElementById('projectModal');
const projOverlay  = document.getElementById('projectOverlay');
const projClose    = document.getElementById('projClose');
const projModalBox = projModal.querySelector('.project-modal');

let lastOpenedItem = null;

/* ── FLIP container morph: card thumbnail → modal ────────────────────
   The modal starts at the card's exact screen rect and expands to its
   natural centred position. Card thumbnail hides so there's no duplicate. */
function morphOpenModal(item) {
  const thumb     = item.querySelector('.project-img img');
  const thumbRect = (thumb || item.querySelector('.project-img')).getBoundingClientRect();
  lastOpenedItem  = item;

  // Hide original thumbnail — it visually "becomes" the modal
  if (thumb) thumb.style.opacity = '0';

  // Make container visible but modal box invisible first
  projModalBox.style.transition = 'none';
  projModalBox.style.opacity    = '0';
  projModal.classList.add('active');
  projOverlay.classList.add('active');
  projModal.setAttribute('aria-hidden', 'false');

  // Measure modal at its natural centred position
  const mr = projModalBox.getBoundingClientRect();
  const dx = (thumbRect.left + thumbRect.width  / 2) - (mr.left + mr.width  / 2);
  const dy = (thumbRect.top  + thumbRect.height / 2) - (mr.top  + mr.height / 2);
  const sx = thumbRect.width  / mr.width;
  const sy = thumbRect.height / mr.height;

  // Set starting state: modal visually sits on top of the card thumbnail
  projModalBox.style.transform    = `translate(${dx}px,${dy}px) scale(${sx},${sy})`;
  projModalBox.style.borderRadius = '16px';

  // Force reflow — locks in the above before we start the transition
  void projModalBox.getBoundingClientRect();

  // Spring ease: fast expansion, gentle settle at the end
  projModalBox.style.transition   = 'transform 260ms cubic-bezier(0.2,0,0,1), opacity 180ms ease, border-radius 260ms ease';
  projModalBox.style.transform    = '';
  projModalBox.style.opacity      = '';
  projModalBox.style.borderRadius = '';

  const onOpenEnd = e => {
    if (e.propertyName !== 'transform') return;
    projModalBox.removeEventListener('transitionend', onOpenEnd);
    projModalBox.style.transition = '';
    // Modal is now fully visible — safe to autoplay the first video
    const firstVideo = document.querySelector('#heroSwiper .swiper-slide-active video');
    if (firstVideo) firstVideo.play().catch(() => {});
  };
  projModalBox.addEventListener('transitionend', onOpenEnd);
}

// cache modal fields
const mHero      = document.getElementById('projHero');
const mTitle     = document.getElementById('projTitle');
const mSubtitle  = document.getElementById('projSubtitle');
const mMeta      = document.getElementById('projMeta');
const mText      = document.getElementById('projText');
const mGall      = document.getElementById('projGallery');
const mLink      = document.getElementById('projLink');

// Platform pill metadata — icon-only
// quest: visor silhouette with lens cutouts (evenodd fill rule)
const META_SVG = `<svg class="pill-svg" viewBox="0 0 22 12" fill="currentColor" style="fill-rule:evenodd;clip-rule:evenodd" xmlns="http://www.w3.org/2000/svg">
  <rect x="0.5" y="0.5" width="21" height="11" rx="3.5"/>
  <rect x="1.5" y="1.5" width="8.5" height="9" rx="2.2"/>
  <rect x="12" y="1.5" width="8.5" height="9" rx="2.2"/>
</svg>`;

const PLATFORM_META = {
  quest:   { html: META_SVG,                                               cls: 'pill-vr',      label: 'Meta Quest' },
  ios:     { html: `<ion-icon name="logo-apple"></ion-icon>`,              cls: 'pill-ios',     label: 'iOS'        },
  android: { html: `<ion-icon name="logo-android"></ion-icon>`,            cls: 'pill-android', label: 'Android'    },
  pc:      { html: `<ion-icon name="desktop-outline"></ion-icon>`,         cls: 'pill-pc',      label: 'PC'         },
  desktop: { html: `<ion-icon name="desktop-outline"></ion-icon>`,         cls: 'pill-pc',      label: 'Desktop'    },
  mac:     { html: `<ion-icon name="laptop-outline"></ion-icon>`,          cls: 'pill-mac',     label: 'macOS'      },
  console: { html: `<ion-icon name="game-controller-outline"></ion-icon>`, cls: 'pill-console', label: 'Console'    },
  pico:    { html: `<ion-icon name="glasses-outline"></ion-icon>`,          cls: 'pill-vr',      label: 'Pico'       },
};

let scrollY = 0;

document.querySelectorAll('.project-item').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();

document.documentElement.style.overflow = 'hidden';  // stop scrolling
document.body.style.overflowY = 'scroll';   
 const y = window.scrollY;


    // 2. Populate modal
    mTitle.textContent = item.dataset.title;

    // Subtitle tagline
    if (mSubtitle) mSubtitle.textContent = item.dataset.subtitle || '';

    // ── Meta bar: Year · Genre · Studio · Platforms ───────────────────────
    const plats = (item.dataset.platforms || '').split(',').map(s => s.trim()).filter(Boolean);
    const platHtml = plats.map(p => {
      const m = PLATFORM_META[p] || { html: `<ion-icon name="help-outline"></ion-icon>`, cls: 'pill-other', label: p };
      return `<span class="platform-pill ${m.cls}" data-label="${m.label}">${m.html}</span>`;
    }).join('');

    const year   = item.dataset.year   || '';
    const genre  = item.dataset.genre  || '';
    const studio = item.dataset.studio || '';

    if (mMeta) {
      const rows = [];
      if (year)         rows.push(`<div class="mp-row"><span class="mp-label">Year</span><span class="mp-value mp-year">◈ ${year}</span></div>`);
      if (genre)        rows.push(`<div class="mp-row"><span class="mp-label">Genre</span><span class="mp-value">${genre}</span></div>`);
      if (studio)       rows.push(`<div class="mp-row"><span class="mp-label">Studio</span><span class="mp-value">${studio}</span></div>`);
      if (plats.length) rows.push(`<div class="mp-row"><span class="mp-label">Platform</span><span class="plat-icons">${platHtml}</span></div>`);
      mMeta.innerHTML = rows.join('');
      mMeta.style.display = rows.length ? '' : 'none';
    }

    const raw = item.dataset.text || '';
    mText.innerHTML = raw.replace(/\\n/g,'<br>');


    
    // ── Build / refresh hero carousel  ────────────────────
    const galleryArr = JSON.parse(item.dataset.gallery || '[]');
    buildHeroSwiper(galleryArr);             // 🌟 NEW LINE
    
// (mHero and mGall DOM manipulation is no longer needed, delete it)

    //   CTAs
    if (item.dataset.link){
  mLink.href        = item.dataset.link;
  mLink.innerHTML   = 'Visit <em class="arrow">↗</em>';
  mLink.style.display = 'inline-flex';
}else{
  mLink.style.display = 'none';
}

    // 3. FLIP morph: card → modal
    morphOpenModal(item);
  });
});

// universal close handler — reverse FLIP morph back to card
let _isClosing = false;
function closeProjModal() {
  if (_isClosing) return;   // already mid-close, ignore repeat triggers
  _isClosing = true;

  if (!lastOpenedItem) { _doClose(); return; }

  const thumb     = lastOpenedItem.querySelector('.project-img img');
  const thumbRect = thumb ? thumb.getBoundingClientRect() : null;

  // If card scrolled off-screen, fade-shrink out
  const inView = thumbRect
    && thumbRect.bottom > 0 && thumbRect.top  < window.innerHeight
    && thumbRect.right  > 0 && thumbRect.left < window.innerWidth;

  if (!inView) {
    projModalBox.style.transition = 'transform 180ms cubic-bezier(0.4,0,1,1), opacity 160ms ease';
    projModalBox.style.transform  = 'scale(0.94)';
    projModalBox.style.opacity    = '0';
    const onFadeEnd = e => {
      if (e.propertyName !== 'opacity') return;
      projModalBox.removeEventListener('transitionend', onFadeEnd);
      projModalBox.style.transition = '';
      projModalBox.style.transform  = '';
      projModalBox.style.opacity    = '';
      _doClose();
    };
    projModalBox.addEventListener('transitionend', onFadeEnd);
    return;
  }

  // Reverse FLIP: shrink modal back to the card's screen position
  const mr = projModalBox.getBoundingClientRect();
  const dx = (thumbRect.left + thumbRect.width  / 2) - (mr.left + mr.width  / 2);
  const dy = (thumbRect.top  + thumbRect.height / 2) - (mr.top  + mr.height / 2);
  const sx = thumbRect.width  / mr.width;
  const sy = thumbRect.height / mr.height;

  projModalBox.style.transition   = 'transform 200ms cubic-bezier(0.4,0,1,1), opacity 160ms ease, border-radius 200ms ease';
  projModalBox.style.transform    = `translate(${dx}px,${dy}px) scale(${sx},${sy})`;
  projModalBox.style.opacity      = '0';
  projModalBox.style.borderRadius = '16px';

  const onFlipEnd = e => {
    if (e.propertyName !== 'transform') return;
    projModalBox.removeEventListener('transitionend', onFlipEnd);
    projModalBox.style.transition   = '';
    projModalBox.style.transform    = '';
    projModalBox.style.opacity      = '';
    projModalBox.style.borderRadius = '';
    _doClose();
  };
  projModalBox.addEventListener('transitionend', onFlipEnd);
}

function _doClose() {
  _isClosing = false;
  // Always restore thumbnail visibility (safety net)
  if (lastOpenedItem) {
    const t = lastOpenedItem.querySelector('.project-img img');
    if (t) t.style.opacity = '';
    lastOpenedItem = null;
  }
  document.querySelectorAll('#heroSwiper video').forEach(v => {
    v.pause();
    v.currentTime = 0;
    v.removeAttribute('src');
    v.load();
  });
  projModal.classList.remove('active');
  projOverlay.classList.remove('active');
  projModal.setAttribute('aria-hidden', 'true');
  document.documentElement.style.overflow = '';
  document.body.style.overflowY = '';
}

projClose.addEventListener('click', closeProjModal);
projOverlay.addEventListener('click', closeProjModal);
window.addEventListener('keyup', e => { if (e.key === 'Escape') closeProjModal(); });



const grid       = document.querySelector('.project-list');
const allItems   = () => grid.querySelectorAll('.project-item.active');  // convenience

function resizeMasonryItem(item){
  const gap    = 30;   // visual gap between cards (px)
  const height = item.getBoundingClientRect().height;
  item.style.gridRowEnd = `span ${Math.ceil(height + gap)}`;
}

function resizeAllMasonryItems(){ allItems().forEach(resizeMasonryItem); }

/* ─ run when the page finishes, whenever you resize, and whenever an
     image *inside* a card finishes loading ─────────────────────────── */

/* Run immediately at DOM-ready (script is defer'd) so intrinsic
   width/height attrs can size the grid before images arrive.       */
resizeAllMasonryItems();

window.addEventListener('load',   resizeAllMasonryItems);
window.addEventListener('resize', resizeAllMasonryItems);

/* Batch masonry recalculations: collect all load events within a single
   animation frame and reflow once instead of once-per-image.            */
let _masonryRafId = null;
function scheduleMasonryResize(){
  if (_masonryRafId) return;
  _masonryRafId = requestAnimationFrame(()=>{
    _masonryRafId = null;
    resizeAllMasonryItems();
  });
}

allItems().forEach(item=>{
  item.querySelectorAll('img').forEach(img=>{
    const onLoad = () => {
      img.classList.add('img-loaded');
      scheduleMasonryResize();
    };
    if (img.complete){
      img.classList.add('img-loaded');
      scheduleMasonryResize();
    }else{
      img.addEventListener('load', onLoad, { once: true });
    }
  });
});

/* ─ Fade-in for all remaining images (ticker, blog, etc.) ──────────── */
document.querySelectorAll('.ticker-track img, .blog-banner-box img').forEach(img => {
  if (img.complete) {
    img.classList.add('img-loaded');
  } else {
    img.addEventListener('load', () => img.classList.add('img-loaded'), { once: true });
  }
});

/* ─ run again every time you change the filter (after your filterFunc) ─ */
const originalFilterFunc = filterFunc;
filterFunc = function(selected){
  originalFilterFunc(selected);      // keep the old behaviour
  requestAnimationFrame(resizeAllMasonryItems);  // then repack
};

/* ── Blurred backdrop for project thumbnails ──────────────────────────
   Sets --thumb CSS custom property on each .project-img so the
   ::before pseudo-element can mirror the thumbnail as a blurred fill.  */
function initThumbBackdrops() {
  document.querySelectorAll('.project-img').forEach(fig => {
    const img = fig.querySelector('img');
    if (!img) return;
    const apply = () => { if (img.src) fig.style.setProperty('--thumb', `url("${img.src}")`); };
    if (img.complete && img.src) apply();
    else img.addEventListener('load', apply);
  });
}
initThumbBackdrops();

/* ── Holographic foil-card hover effect ────────────────────────────────
   Samples colours from each thumbnail, drives CSS vars (--mx, --my, --ha,
   --c1–c4, --cm) and applies a 3-D tilt to the <a> on mousemove.       */
function initCardShine() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  document.querySelectorAll('.project-img').forEach(fig => {
    const img = fig.querySelector('img');
    if (!img) return;

    const sampleColor = (sx, sy) => {
      try {
        ctx.drawImage(img, sx * img.naturalWidth, sy * img.naturalHeight, 1, 1, 0, 0, 1, 1);
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        return `${r},${g},${b}`;
      } catch (e) { return '180,180,220'; }
    };

    const doSample = () => {
      fig.style.setProperty('--c1', sampleColor(0.15, 0.15));
      fig.style.setProperty('--c2', sampleColor(0.85, 0.15));
      fig.style.setProperty('--cm', sampleColor(0.5,  0.5));
      fig.style.setProperty('--c3', sampleColor(0.15, 0.85));
      fig.style.setProperty('--c4', sampleColor(0.85, 0.85));
    };

    if (img.complete && img.naturalWidth) doSample();
    else img.addEventListener('load', doSample, { once: true });

    const anchor = fig.closest('a');
    if (!anchor) return;
    let raf = null;
    let sparkleTimer = null;

    /* Spawn a single glitter particle drifting outward from a random card edge */
    const spawnSparkle = () => {
      const rect = anchor.getBoundingClientRect();
      const sp   = document.createElement('span');
      sp.className = 'card-sparkle';

      // Pick an edge and spawn near it; bias drift direction outward
      const edge = Math.floor(Math.random() * 4);
      let x, y, outAngle;
      const spread = Math.PI * 0.8; // ±72° spread from outward direction
      switch (edge) {
        case 0: // top
          x = rect.left + Math.random() * rect.width;
          y = rect.top  + Math.random() * 18;
          outAngle = -Math.PI / 2 + (Math.random() - 0.5) * spread;
          break;
        case 1: // right
          x = rect.right  - Math.random() * 18;
          y = rect.top    + Math.random() * rect.height;
          outAngle = (Math.random() - 0.5) * spread;
          break;
        case 2: // bottom
          x = rect.left + Math.random() * rect.width;
          y = rect.bottom - Math.random() * 18;
          outAngle = Math.PI / 2 + (Math.random() - 0.5) * spread;
          break;
        default: // left
          x = rect.left + Math.random() * 18;
          y = rect.top  + Math.random() * rect.height;
          outAngle = Math.PI + (Math.random() - 0.5) * spread;
      }

      const dist  = 12 + Math.random() * 18;
      const dx    = (Math.cos(outAngle) * dist).toFixed(1);
      const dy    = (Math.sin(outAngle) * dist).toFixed(1);
      const size  = (1.5 + Math.random() * 2.5).toFixed(1);
      const dur   = (0.6 + Math.random() * 0.6).toFixed(2);
      const dr    = (Math.random() * 200 - 100).toFixed(0); // gentle spin ±100°
      const gold  = ['#ffd700','#ffb300','#ffe580','#fff4a3','#ffcc44','#ffffff','#ffeaa0'];
      const color = gold[Math.floor(Math.random() * gold.length)];
      const isStar = Math.random() < 0.4;

      sp.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${size}px;` +
        `background:${color};box-shadow:0 0 2px 0px ${color}80;` +
        `--dx:${dx}px;--dy:${dy}px;--dr:${dr}deg;--sd:${dur}s;` +
        (isStar ? 'clip-path:polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,' +
                  '50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);border-radius:0;'
                : 'border-radius:50%;');

      document.body.appendChild(sp);
      sp.addEventListener('animationend', () => sp.remove(), { once: true });
    };

    anchor.addEventListener('mouseenter', () => {
      anchor.style.willChange = 'transform';
      fig.classList.add('is-hovered');
      sparkleTimer = setInterval(spawnSparkle, 90);
    });

    anchor.addEventListener('mousemove', e => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const rect = anchor.getBoundingClientRect();
        const mx = (e.clientX - rect.left) / rect.width;
        const my = (e.clientY - rect.top)  / rect.height;
        const rx = (my - 0.5) * -12;
        const ry = (mx - 0.5) *  12;
        const ha = Math.round(mx * 360);
        anchor.style.transform =
          `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.03,1.03,1.03)`;
        fig.style.setProperty('--mx', mx.toFixed(3));
        fig.style.setProperty('--my', my.toFixed(3));
        fig.style.setProperty('--ha', ha);
      });
    });

    anchor.addEventListener('mouseleave', () => {
      clearInterval(sparkleTimer);
      sparkleTimer = null;
      fig.classList.remove('is-hovered');
      anchor.style.transform = '';
      const cleanup = () => {
        anchor.style.willChange = '';
        anchor.removeEventListener('transitionend', cleanup);
      };
      anchor.addEventListener('transitionend', cleanup);
    });
  });
}
initCardShine();
