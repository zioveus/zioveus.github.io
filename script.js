(function () {
  'use strict';

  // Current year in footer
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Get video ID from any YouTube URL (watch, youtu.be, embed)
  function getYouTubeVideoId(url) {
    if (!url) return null;
    try {
      var u = new URL(url);
      if (u.hostname === 'youtu.be') return u.pathname.slice(1).split('?')[0] || null;
      if (u.searchParams.get('v')) return u.searchParams.get('v');
      var m = u.pathname.match(/\/embed\/([^/?]+)/);
      return m ? m[1] : null;
    } catch (e) {
      return null;
    }
  }

  // Load YouTube via same-origin relay to fix Error 153 (YouTube needs correct referrer from our domain)
  function loadYouTubeEmbeds() {
    var iframes = document.querySelectorAll('.youtube-embed[data-video-url]');
    var relayUrl = 'embed.html';
    for (var i = 0; i < iframes.length; i++) {
      var iframe = iframes[i];
      var url = iframe.getAttribute('data-video-url');
      var id = getYouTubeVideoId(url);
      if (id) {
        iframe.src = relayUrl + '?v=' + encodeURIComponent(id);
      }
    }
  }

  // Subtle frog easter egg: five quick clicks on the site title
  function initFrogEaster() {
    var title = document.querySelector('.site-title');
    var frog = document.getElementById('frog-easter');
    if (!title || !frog) return;

    var clicks = 0;
    var resetTimer = null;
    var hideTimer = null;
    var needed = 5;
    var windowMs = 2000;
    var showMs = 4000;

    title.addEventListener('click', function () {
      clicks += 1;
      clearTimeout(resetTimer);
      resetTimer = setTimeout(function () {
        clicks = 0;
      }, windowMs);

      if (clicks < needed) return;
      clicks = 0;

      frog.hidden = false;
      frog.setAttribute('aria-hidden', 'false');
      frog.classList.add('frog-easter--visible');

      clearTimeout(hideTimer);
      hideTimer = setTimeout(function () {
        frog.classList.remove('frog-easter--visible');
        setTimeout(function () {
          frog.hidden = true;
          frog.setAttribute('aria-hidden', 'true');
        }, 800);
      }, showMs);
    });
  }

  function onReady() {
    loadYouTubeEmbeds();
    initFrogEaster();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();
