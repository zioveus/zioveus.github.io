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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadYouTubeEmbeds);
  } else {
    loadYouTubeEmbeds();
  }
})();
