// analytics.js — GA4 custom event tracking

const _gtag = (...args) => {
  if (typeof gtag === 'function') gtag(...args);
};

// 1. Section navigation
document.querySelectorAll('[data-nav-link]').forEach(link => {
  link.addEventListener('click', function () {
    _gtag('event', 'section_view', {
      section_name: this.textContent.trim().toLowerCase()
    });
  });
});

// 2. Project modal open
document.querySelectorAll('.project-item').forEach(item => {
  item.addEventListener('click', () => {
    _gtag('event', 'project_view', {
      project_name:     item.dataset.title    || '',
      project_category: item.dataset.category || '',
      project_year:     item.dataset.year     || '',
      project_studio:   item.dataset.studio   || ''
    });
  });
});

// 3. Project "Visit ↗" link in modal
document.getElementById('projLink')?.addEventListener('click', function () {
  _gtag('event', 'outbound_click', {
    link_url:     this.href,
    project_name: document.getElementById('projTitle')?.textContent || ''
  });
});

// 4. Social links (easter-egg buttons — skip if already "shot")
document.querySelectorAll('.social-link').forEach(link => {
  link.addEventListener('click', function () {
    if (this.classList.contains('is-shot')) return;
    const icon     = this.querySelector('ion-icon');
    const platform = icon ? icon.getAttribute('name').replace('logo-', '') : 'unknown';
    _gtag('event', 'social_click', { social_platform: platform });
  });
});

// 5. Contact form result (dispatched from script.js)
document.querySelector('[data-form]')?.addEventListener('formResult', e => {
  _gtag('event', 'form_submit', {
    form_name: 'contact',
    status:    e.detail.status   // 'success' | 'error'
  });
});
