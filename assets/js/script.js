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

function buildHeroSwiper(slideSrcArray){
  const wrapper = document.querySelector('#heroSwiper .swiper-wrapper');
  wrapper.innerHTML = '';                // clear previous slides

  slideSrcArray.forEach(src => {
    const slide  = document.createElement('div');
    slide.className = 'swiper-slide';

    const isVideo = /\.(mp4|webm|ogg)$/i.test(src);
    const media   = isVideo
      ? Object.assign(document.createElement('video'), {
          src, controls:true, playsInline:true })
      : Object.assign(new Image(), {
          src, alt:'project asset', loading:'lazy' });

    slide.appendChild(media);
    wrapper.appendChild(slide);
  });

  // re-initialise (destroys old instance to avoid duplicates)
  if (heroSwiper) heroSwiper.destroy(true, true);

  heroSwiper = new Swiper('#heroSwiper', {
    loop:        slideSrcArray.length > 3,
    speed:       600,
    grabCursor:  true,
    keyboard:    { enabled:true },
    navigation:  { nextEl: '#heroSwiper-next', prevEl: '#heroSwiper-prev' },
    pagination:  { el: '.swiper-pagination', clickable:true }
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

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



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

  });
}

const portfolioBtn = [...document.querySelectorAll('[data-nav-link]')]
                     .find(b => b.textContent.trim().toLowerCase() === 'portfolio');

document.querySelectorAll('.clients-item a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();

    const targetId = link.dataset.scroll;      // e.g. "dungems"
    if (!targetId) return;

    portfolioBtn?.click();                     // trigger your existing nav logic

    /* Wait one frame so the .portfolio page is visible,
       then scroll the chosen card into view                      */
    requestAnimationFrame(() => {
      document.getElementById(targetId)
              ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
});



const projModal   = document.getElementById('projectModal');
const projOverlay = document.getElementById('projectOverlay');
const projClose   = document.getElementById('projClose');

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

    // 3. Show modal
    projModal.classList.add('active');3
    projOverlay.classList.add('active');
    projModal.setAttribute('aria-hidden','false');
  });
});

// universal close handler
function closeProjModal(){

  document.querySelectorAll('#heroSwiper video').forEach(v => {
    v.pause();
    v.currentTime = 0;
    v.removeAttribute('src');   // releases memory
    v.load();
  });
  
  projModal.classList.remove('active');
  projOverlay.classList.remove('active');
  projModal.setAttribute('aria-hidden','true');

document.documentElement.style.overflow = '';
document.body.style.overflowY = '';
}

projClose.addEventListener('click', closeProjModal);
projOverlay.addEventListener('click', closeProjModal);
window.addEventListener('keyup', e => { if (e.key === 'Escape') closeProjModal(); });



const grid       = document.querySelector('.project-list');
const allItems   = () => grid.querySelectorAll('.project-item.active');  // convenience

function resizeMasonryItem(item){
  const rowGap    = 30;   // keep in sync with CSS gap
  const rowHeight = 12;   // keep in sync with grid-auto-rows
  const height    = item.getBoundingClientRect().height;
  const rowSpan   = Math.ceil((height + rowGap) / (rowHeight + rowGap));
  item.style.gridRowEnd = `span ${rowSpan}`;
}

function resizeAllMasonryItems(){ allItems().forEach(resizeMasonryItem); }

/* ─ run when the page finishes, whenever you resize, and whenever an
     image *inside* a card finishes loading ─────────────────────────── */

window.addEventListener('load',   resizeAllMasonryItems);
window.addEventListener('resize', resizeAllMasonryItems);

allItems().forEach(item=>{
  item.querySelectorAll('img').forEach(img=>{
    if (img.complete){
      resizeMasonryItem(item);
    }else{
      img.addEventListener('load', ()=>resizeMasonryItem(item));
    }
  });
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
