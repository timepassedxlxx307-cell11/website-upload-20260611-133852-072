(function () {
  const toggle = document.querySelector('[data-menu-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const dots = Array.from(document.querySelectorAll('.hero-dot'));
  let heroIndex = 0;
  let heroTimer = null;

  function showHero(index) {
    if (!slides.length) {
      return;
    }

    heroIndex = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === heroIndex);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === heroIndex);
    });
  }

  function startHero() {
    if (heroTimer || slides.length < 2) {
      return;
    }

    heroTimer = window.setInterval(function () {
      showHero(heroIndex + 1);
    }, 5200);
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      const nextIndex = Number(dot.getAttribute('data-hero-dot')) || 0;
      showHero(nextIndex);
      if (heroTimer) {
        window.clearInterval(heroTimer);
        heroTimer = null;
      }
      startHero();
    });
  });

  showHero(0);
  startHero();

  const searchInputs = Array.from(document.querySelectorAll('[data-site-search]'));

  function applySearch(input) {
    const scopeSelector = input.getAttribute('data-scope');
    const scope = scopeSelector ? document.querySelector(scopeSelector) : document;

    if (!scope) {
      return;
    }

    const keyword = input.value.trim().toLowerCase();
    const cards = Array.from(scope.querySelectorAll('.movie-card'));

    cards.forEach(function (card) {
      const text = [
        card.getAttribute('data-title') || '',
        card.getAttribute('data-type') || '',
        card.getAttribute('data-genre') || '',
        card.getAttribute('data-year') || '',
        card.textContent || ''
      ].join(' ').toLowerCase();

      card.hidden = keyword.length > 0 && text.indexOf(keyword) === -1;
    });
  }

  searchInputs.forEach(function (input) {
    input.addEventListener('input', function () {
      applySearch(input);
    });
  });

  Array.from(document.querySelectorAll('[data-search-clear]')).forEach(function (button) {
    button.addEventListener('click', function () {
      const panel = button.closest('.search-panel');
      const input = panel ? panel.querySelector('[data-site-search]') : null;

      if (input) {
        input.value = '';
        applySearch(input);
        input.focus();
      }
    });
  });

  const player = document.getElementById('movie-player');
  const trigger = document.getElementById('play-trigger');
  const source = document.body ? document.body.getAttribute('data-video-url') : '';
  let playerReady = false;
  let hlsInstance = null;

  function attachPlayer() {
    if (!player || !source || playerReady) {
      return;
    }

    playerReady = true;

    if (player.canPlayType('application/vnd.apple.mpegurl')) {
      player.src = source;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(player);
      return;
    }

    player.src = source;
  }

  function startPlayer() {
    if (!player) {
      return;
    }

    attachPlayer();

    if (trigger) {
      trigger.classList.add('is-hidden');
    }

    const promise = player.play();

    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {
        if (trigger) {
          trigger.classList.remove('is-hidden');
        }
      });
    }
  }

  if (trigger) {
    trigger.addEventListener('click', startPlayer);
  }

  if (player) {
    player.addEventListener('click', function () {
      if (player.paused) {
        startPlayer();
      }
    });
  }

  window.addEventListener('pagehide', function () {
    if (hlsInstance && typeof hlsInstance.destroy === 'function') {
      hlsInstance.destroy();
    }
  });
})();
