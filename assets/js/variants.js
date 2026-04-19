/* Portfolio variants.
 *
 * The inline head bootstrap in index.html / cv.html reads the variant from
 * (URL ?v=, localStorage, cookie, "default") and sets <html data-variant="...">
 * synchronously before first paint. CSS handles visibility from there.
 *
 * This script applies the rest of the variant behavior:
 *   - ordering: data-variant-order-<key>
 *       * .ticker-track children are physically reordered in the DOM so the
 *         ticker's clone-for-infinite-loop step (in script.js) sees the
 *         reordered source nodes. CSS `order` would cluster duplicates
 *         next to each other after cloning.
 *       * Other containers (projects, skills, services) use CSS `order`.
 *   - text swaps: data-variant-text-<key>  → element.textContent
 *   - link rewrites: [data-variant-href]   → href="<base>?v=<current>"
 *
 * Admin switcher: when ?admin=1 (or sessionStorage.pvAdmin) is set, we inject
 * a floating pill that writes the new variant to storage and reloads. Reloading
 * avoids tricky live-swap cases (ticker clones, masonry reflow, swiper modals).
 */
(function () {
  'use strict';

  var VARIANTS = ['default', 'ai'];
  var VARIANT_LABELS = { default: 'Default', ai: 'Agentic AI' };
  var STORAGE_KEY = 'pv';
  var COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

  function currentVariant() {
    var v = document.documentElement.dataset.variant;
    return VARIANTS.indexOf(v) >= 0 ? v : 'default';
  }

  function persistVariant(v) {
    try { localStorage.setItem(STORAGE_KEY, v); } catch (e) {}
    document.cookie = STORAGE_KEY + '=' + v + ';path=/;max-age=' + COOKIE_MAX_AGE + ';samesite=lax';
  }

  function applyOrdering(variant) {
    var attr = 'data-variant-order-' + variant;
    if (variant === 'default') return; // no ordering attrs for default

    var matches = document.querySelectorAll('[' + attr + ']');
    if (!matches.length) return;

    // Group matched elements by parent so we can decide physical vs CSS order.
    var groups = new Map();
    matches.forEach(function (el) {
      var p = el.parentElement;
      if (!p) return;
      if (!groups.has(p)) groups.set(p, []);
      groups.get(p).push(el);
    });

    groups.forEach(function (items, parent) {
      var usePhysical = parent.classList.contains('ticker-track');
      items.sort(function (a, b) {
        return Number(a.getAttribute(attr)) - Number(b.getAttribute(attr));
      });
      if (usePhysical) {
        items.forEach(function (el) { parent.appendChild(el); });
      } else {
        items.forEach(function (el) {
          el.style.order = String(el.getAttribute(attr));
        });
      }
    });
  }

  function applyTextSwaps(variant) {
    if (variant === 'default') return;
    var attr = 'data-variant-text-' + variant;
    document.querySelectorAll('[' + attr + ']').forEach(function (el) {
      el.textContent = el.getAttribute(attr);
    });
  }

  function applyLinkRewrites(variant) {
    document.querySelectorAll('[data-variant-href]').forEach(function (a) {
      var base = a.getAttribute('data-variant-href');
      if (!base) return;
      var sep = base.indexOf('?') >= 0 ? '&' : '?';
      a.setAttribute('href', base + sep + 'v=' + variant);
    });
  }

  function apply(variant) {
    if (VARIANTS.indexOf(variant) < 0) variant = 'default';
    document.documentElement.dataset.variant = variant;
    applyOrdering(variant);
    applyTextSwaps(variant);
    applyLinkRewrites(variant);
    if (typeof window.resizeAllMasonryItems === 'function') {
      requestAnimationFrame(window.resizeAllMasonryItems);
    }
    document.dispatchEvent(new CustomEvent('variant:applied', { detail: { variant: variant } }));
  }

  function setVariant(variant) {
    if (VARIANTS.indexOf(variant) < 0) return;
    persistVariant(variant);
    // Reload so ticker clones, masonry, swiper and any other one-shot init
    // code re-runs cleanly against the new variant.
    location.reload();
  }

  /* ---- Admin switcher ------------------------------------------------ */

  function isLocal() {
    if (location.protocol === 'file:') return true;
    var h = location.hostname;
    return h === 'localhost' || h === '127.0.0.1' || h === '::1' || h === '';
  }

  function isAdmin() {
    var p = new URLSearchParams(location.search);
    if (p.get('admin') === '1') {
      try { sessionStorage.setItem('pvAdmin', '1'); } catch (e) {}
      return true;
    }
    if (isLocal()) return true;
    try { return sessionStorage.getItem('pvAdmin') === '1'; } catch (e) { return false; }
  }

  function mountSwitcher() {
    if (!isAdmin()) return;
    try {
      if (sessionStorage.getItem('pvSwitcherHidden') === '1') return;
    } catch (e) {}

    var el = document.createElement('div');
    el.className = 'variant-switcher';
    el.setAttribute('role', 'group');
    el.setAttribute('aria-label', 'Preview variant');

    var label = document.createElement('span');
    label.className = 'variant-switcher__label';
    label.textContent = 'Variant';
    el.appendChild(label);

    var current = currentVariant();
    VARIANTS.forEach(function (v) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.dataset.variant = v;
      btn.textContent = VARIANT_LABELS[v] || v;
      if (v === current) btn.classList.add('is-active');
      btn.addEventListener('click', function () { setVariant(v); });
      el.appendChild(btn);
    });

    var close = document.createElement('button');
    close.type = 'button';
    close.className = 'variant-switcher__close';
    close.setAttribute('aria-label', 'Hide variant switcher');
    close.textContent = '\u00D7';
    close.addEventListener('click', function () {
      try { sessionStorage.setItem('pvSwitcherHidden', '1'); } catch (e) {}
      el.remove();
    });
    el.appendChild(close);

    document.body.appendChild(el);
  }

  /* ---- Bootstrap ----------------------------------------------------- */

  function init() {
    apply(currentVariant());
    mountSwitcher();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.portfolioVariants = {
    get: currentVariant,
    set: setVariant,
    list: VARIANTS.slice()
  };
})();
