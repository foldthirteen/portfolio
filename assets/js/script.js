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
    loop:        true,
    speed:       600,
    grabCursor:  true,
    keyboard:    { enabled:true },
    navigation:  { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
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

const filterFunc = function (selectedValue) {

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


const projModal   = document.getElementById('projectModal');
const projOverlay = document.getElementById('projectOverlay');
const projClose   = document.getElementById('projClose');

// cache modal fields
const mHero   = document.getElementById('projHero');
const mTitle  = document.getElementById('projTitle');
const mText   = document.getElementById('projText');
const mGall   = document.getElementById('projGallery');
const mLink   = document.getElementById('projLink');

let scrollY = 0;

document.querySelectorAll('.project-item').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();

document.documentElement.style.overflow = 'hidden';  // stop scrolling
document.body.style.overflowY = 'scroll';   
 const y = window.scrollY;


    // 2. Populate modal
   //mHero.src      = item.dataset.hero;
   //mHero.alt      = item.dataset.title + ' hero';
    mTitle.textContent = item.dataset.title;

    mTitle.innerHTML = `
      <span>${item.dataset.title}</span>
      ${ item.dataset.year
            ? `<span class="badge-year">${item.dataset.year}</span>`
            : '' }
    `;

    const raw = item.dataset.text || '';
    mText.innerHTML = raw.replace(/\\n/g,'<br>');


    
    // ── Build / refresh hero carousel  ────────────────────
    const galleryArr = JSON.parse(item.dataset.gallery || '[]');
    buildHeroSwiper(galleryArr);             // 🌟 NEW LINE
    
// (mHero and mGall DOM manipulation is no longer needed, delete it)

    //   CTAs
    if (item.dataset.link){
  mLink.href        = item.dataset.link;
  mLink.textContent = 'Visit ↗';           // ▲ NEW label
  mLink.style.display = 'inline-block';
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
