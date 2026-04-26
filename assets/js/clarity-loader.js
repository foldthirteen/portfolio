// Microsoft Clarity loader for the portfolio.
// Use ?clarity=off to opt this browser out, or ?clarity=on to force-enable
// local testing and clear a previous opt-out.
(function () {
  var CLARITY_ID = 'w93s33m3f6';
  var OPT_OUT_KEY = 'clarityOptOut';
  var params = new URLSearchParams(window.location.search);
  var hashParams = new URLSearchParams((location.hash || '').replace(/^#/, ''));
  var clarityFlag = params.get('clarity');
  var outreachIdParam = params.get('o') || hashParams.get('o');
  var jobDescriptorParam = params.get('jd') || hashParams.get('jd');

  function propagateOutreachParams() {
    if (!outreachIdParam && !jobDescriptorParam) return;

    document.querySelectorAll('a[href*="foldthirteen.github.io/portfolio"]').forEach(function (link) {
      try {
        var url = new URL(link.href);
        var linkHash = new URLSearchParams((url.hash || '').replace(/^#/, ''));
        if (outreachIdParam) linkHash.set('o', outreachIdParam.slice(0, 80));
        if (jobDescriptorParam) linkHash.set('jd', jobDescriptorParam.slice(0, 80));
        url.hash = linkHash.toString();
        link.href = url.toString();
      } catch (e) {}
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', propagateOutreachParams);
  } else {
    propagateOutreachParams();
  }

  if (clarityFlag === 'off' || clarityFlag === 'on') {
    try {
      if (clarityFlag === 'off') localStorage.setItem(OPT_OUT_KEY, '1');
      else localStorage.removeItem(OPT_OUT_KEY);
    } catch (e) {}

    params.delete('clarity');
    var query = params.toString();
    history.replaceState(null, '', location.pathname + (query ? '?' + query : '') + location.hash);
  }

  try {
    if (localStorage.getItem(OPT_OUT_KEY) === '1') return;
  } catch (e) {}

  var isLocal = location.protocol === 'file:'
    || /^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[?::1\]?)$/i.test(location.hostname);

  if (isLocal && clarityFlag !== 'on') return;

  (function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, 'clarity', 'script', CLARITY_ID);

  if (typeof window.clarity === 'function') {
    var variant = document.documentElement.dataset.variant || 'default';
    var path = location.pathname || '/';
    var isCvPage = path.indexOf('/cv') !== -1 || /cv/i.test(document.title);
    var cvType = 'none';
    var referrerHost = 'direct';

    try {
      referrerHost = document.referrer ? new URL(document.referrer).hostname : 'direct';
    } catch (e) {}

    if (isCvPage) {
      if (/ai/i.test(path) || /ai engineer/i.test(document.title)) cvType = 'ai';
      else if (/gamedev|game developer/i.test(path) || /game developer/i.test(document.title)) cvType = 'game_developer';
      else if (/upwork/i.test(path) || /upwork/i.test(document.title)) cvType = 'upwork';
      else cvType = variant === 'ai' ? 'ai_variant' : 'general';
    }

    window.clarity('set', 'site', 'portfolio');
    window.clarity('set', 'page_path', path);
    window.clarity('set', 'page_type', isCvPage ? 'cv' : 'portfolio');
    window.clarity('set', 'portfolio_variant', variant);
    window.clarity('set', 'traffic_source', referrerHost);
    if (isCvPage) {
      window.clarity('set', 'cv_type', cvType);
      window.clarity('event', 'cv_view_' + cvType);
    }

    function tagParam(paramName, tagName) {
      var value = new URLSearchParams(window.location.search).get(paramName);
      if (value) window.clarity('set', tagName || paramName, value.slice(0, 80));
    }

    // Compact outreach links can use ?o=<code> or #o=<code>.
    // Keep the code pseudonymous, e.g. k7p, not an email address.
    if (outreachIdParam) {
      var cleanOutreachId = outreachIdParam.slice(0, 80);

      window.clarity('set', 'outreach_id', cleanOutreachId);
      window.clarity('event', 'outreach_link_open');
    }
    if (jobDescriptorParam) {
      window.clarity('set', 'job_descriptor', jobDescriptorParam.slice(0, 80));
    }

    [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_content',
      'utm_term',
      'cv_id',
      'cv_version',
      'outreach_id',
      'outreach_channel',
      'role_track',
      'recipient_code'
    ].forEach(function (key) {
      tagParam(key);
    });

    document.addEventListener('DOMContentLoaded', function () {
      document.querySelectorAll('.cv-toolbar__btn').forEach(function (button) {
        button.addEventListener('click', function () {
          window.clarity('event', 'cv_print_' + cvType);
        });
      });

      document.querySelectorAll('.cv-header__contact a[href*="foldthirteen.github.io/portfolio"]').forEach(function (link) {
        link.addEventListener('click', function () {
          window.clarity('event', 'cv_portfolio_click_' + cvType);
        });
      });
    });
  }
})();
