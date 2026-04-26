// analytics.js — GA4 + Microsoft Clarity custom event tracking

const _gtag = (...args) => {
  if (typeof window.gtag === 'function') window.gtag(...args);
};

const _clarity = (...args) => {
  if (typeof window.clarity === 'function') window.clarity(...args);
};

const cleanValue = value => String(value || '').trim().slice(0, 120);

const toEventName = value => cleanValue(value)
  .toLowerCase()
  .replace(/&/g, 'and')
  .replace(/[^a-z0-9]+/g, '_')
  .replace(/^_+|_+$/g, '')
  .slice(0, 80);

const claritySet = (key, value) => {
  const cleaned = cleanValue(value);
  if (cleaned) _clarity('set', key, cleaned);
};

const clarityEvent = name => {
  const eventName = toEventName(name);
  if (eventName) _clarity('event', eventName);
};

const linkDomain = href => {
  try { return new URL(href, location.href).hostname; }
  catch (e) { return ''; }
};

claritySet('active_section', document.querySelector('[data-page].active')?.dataset.page || 'about');

// 1. Section navigation
document.querySelectorAll('[data-nav-link]').forEach(link => {
  link.addEventListener('click', function () {
    const section = this.textContent.trim().toLowerCase();
    _gtag('event', 'section_view', {
      section_name: section
    });
    claritySet('active_section', section);
    clarityEvent(`section_view_${section}`);
  });
});

// 2. Project modal open
document.querySelectorAll('.project-item').forEach(item => {
  item.addEventListener('click', () => {
    const projectName = item.dataset.title || '';
    const projectCategory = item.dataset.category || '';
    const projectYear = item.dataset.year || '';
    const projectStudio = item.dataset.studio || '';

    _gtag('event', 'project_view', {
      project_name:     projectName,
      project_category: projectCategory,
      project_year:     projectYear,
      project_studio:   projectStudio
    });
    claritySet('project_name', projectName);
    claritySet('project_category', projectCategory);
    claritySet('project_year', projectYear);
    claritySet('project_studio', projectStudio);
    clarityEvent(`project_view_${projectName}`);
  });
});

// 3. Project "Visit ↗" link in modal
document.getElementById('projLink')?.addEventListener('click', function () {
  const projectName = document.getElementById('projTitle')?.textContent || '';
  _gtag('event', 'outbound_click', {
    link_url:     this.href,
    project_name: projectName
  });
  claritySet('outbound_domain', linkDomain(this.href));
  claritySet('outbound_project', projectName);
  clarityEvent(`project_outbound_${projectName}`);
});

// 4. Social links (easter-egg buttons — skip if already "shot")
document.querySelectorAll('.social-link').forEach(link => {
  link.addEventListener('click', function () {
    if (this.classList.contains('is-shot')) return;
    const icon     = this.querySelector('ion-icon');
    const platform = icon ? icon.getAttribute('name').replace('logo-', '') : 'unknown';
    _gtag('event', 'social_click', { social_platform: platform });
    claritySet('social_platform', platform);
    clarityEvent(`social_click_${platform}`);
  });
});

// 5. Portfolio filters
document.querySelectorAll('[data-filter-btn], [data-select-item]').forEach(control => {
  control.addEventListener('click', function () {
    const filter = this.textContent.trim().toLowerCase();
    claritySet('portfolio_filter', filter);
    clarityEvent(`portfolio_filter_${filter}`);
  });
});

// 6. Resume CV link
document.querySelector('.cv-btn')?.addEventListener('click', function () {
  const href = this.getAttribute('href') || '';
  const target = href.split('?')[0] || 'unknown';
  _gtag('event', 'cv_click', { cv_target: target });
  claritySet('cv_target', target);
  clarityEvent(`cv_click_${target}`);
});

// 7. Service cards
document.querySelectorAll('.service-item[role="button"]').forEach(item => {
  const trackServiceOpen = () => {
    const service = item.querySelector('.service-item-title')?.textContent || '';
    claritySet('service_area', service);
    clarityEvent(`service_open_${service}`);
  };

  item.addEventListener('click', trackServiceOpen);
  item.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') trackServiceOpen();
  });
});

// 8. Links that jump from a ticker/service chip into a project.
document.addEventListener('click', e => {
  const scrollLink = e.target.closest('a[data-scroll]');
  if (!scrollLink) return;

  const target = document.getElementById(scrollLink.dataset.scroll);
  if (!target?.classList.contains('project-item')) return;

  claritySet('project_jump_target', target.dataset.title || scrollLink.dataset.scroll);
  clarityEvent(`project_jump_${target.dataset.title || scrollLink.dataset.scroll}`);
});

// 9. Contact intent and form result
document.querySelectorAll('.contact-link[href^="mailto:"], .contact-link[href^="tel:"]').forEach(link => {
  link.addEventListener('click', function () {
    const channel = this.href.startsWith('mailto:') ? 'email' : 'phone';
    claritySet('contact_channel', channel);
    clarityEvent(`contact_link_${channel}`);
  });
});

let contactStarted = false;
document.querySelectorAll('[data-form-input]').forEach(input => {
  input.addEventListener('input', () => {
    if (contactStarted) return;
    contactStarted = true;
    clarityEvent('contact_form_started');
  }, { once: true });
});

document.querySelector('[data-form]')?.addEventListener('submit', function () {
  if (!this.checkValidity()) {
    clarityEvent('contact_form_invalid');
  }
});

// Form result is dispatched from script.js.
document.querySelector('[data-form]')?.addEventListener('formResult', e => {
  _gtag('event', 'form_submit', {
    form_name: 'contact',
    status:    e.detail.status   // 'success' | 'error'
  });
  claritySet('contact_form_status', e.detail.status);
  clarityEvent(`contact_form_${e.detail.status}`);
});
