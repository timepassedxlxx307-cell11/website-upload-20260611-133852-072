(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
      return;
    }
    document.addEventListener("DOMContentLoaded", fn);
  }

  function setupMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-mobile-nav]");
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  function setupHero() {
    var slider = document.querySelector("[data-hero-slider]");
    if (!slider) {
      return;
    }
    var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
    var prev = slider.querySelector("[data-hero-prev]");
    var next = slider.querySelector("[data-hero-next]");
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
        start();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        start();
      });
    }

    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);
    start();
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function filterCards(cards, query, year) {
    var count = 0;
    cards.forEach(function (card) {
      var text = normalize(card.getAttribute("data-search-text"));
      var cardYear = String(card.getAttribute("data-year") || "");
      var okQuery = !query || text.indexOf(query) !== -1;
      var okYear = !year || cardYear === year;
      var visible = okQuery && okYear;
      card.hidden = !visible;
      if (visible) {
        count += 1;
      }
    });
    return count;
  }

  function setupLocalFilter() {
    var lists = Array.prototype.slice.call(document.querySelectorAll("[data-filter-list]"));
    if (!lists.length) {
      return;
    }
    var queryInput = document.querySelector("[data-local-filter]");
    var yearSelect = document.querySelector("[data-year-filter]");
    var empty = document.querySelector("[data-empty-state]");
    var cards = [];
    lists.forEach(function (list) {
      cards = cards.concat(Array.prototype.slice.call(list.querySelectorAll("[data-movie-card]")));
    });

    function update() {
      var query = normalize(queryInput && queryInput.value);
      var year = yearSelect ? String(yearSelect.value || "") : "";
      var count = filterCards(cards, query, year);
      if (empty) {
        empty.hidden = count !== 0;
      }
    }

    if (queryInput) {
      queryInput.addEventListener("input", update);
    }
    if (yearSelect) {
      yearSelect.addEventListener("change", update);
    }
    update();
  }

  function setupSearchPage() {
    var list = document.querySelector("[data-search-list]");
    var input = document.querySelector("[data-search-input]");
    if (!list || !input) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var initial = params.get("q") || "";
    var cards = Array.prototype.slice.call(list.querySelectorAll("[data-movie-card]"));
    var empty = document.querySelector("[data-empty-state]");
    var resultText = document.querySelector("[data-result-text]");

    function update() {
      var query = normalize(input.value);
      var count = filterCards(cards, query, "");
      if (empty) {
        empty.hidden = count !== 0;
      }
      if (resultText) {
        resultText.textContent = query ? "已筛选出相关内容" : "输入关键词后即可筛选";
      }
    }

    input.value = initial;
    input.addEventListener("input", update);
    update();
  }

  function attachHls(video, url, button) {
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
      video.play().catch(function () {
        button.classList.remove("is-hidden");
      });
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      if (video.__hlsPlayer) {
        video.__hlsPlayer.destroy();
      }
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: false
      });
      video.__hlsPlayer = hls;
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
        video.play().catch(function () {
          button.classList.remove("is-hidden");
        });
      });
      hls.on(window.Hls.Events.ERROR, function (event, data) {
        if (!data || !data.fatal) {
          return;
        }
        if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
          hls.startLoad();
          return;
        }
        if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError();
          return;
        }
        hls.destroy();
        button.classList.remove("is-hidden");
      });
      return;
    }

    video.src = url;
    video.play().catch(function () {
      button.classList.remove("is-hidden");
    });
  }

  function setupPlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));
    players.forEach(function (player) {
      var video = player.querySelector("video");
      var button = player.querySelector("[data-play-url]");
      if (!video || !button) {
        return;
      }
      function start() {
        var url = button.getAttribute("data-play-url");
        if (!url) {
          return;
        }
        button.classList.add("is-hidden");
        attachHls(video, url, button);
      }
      button.addEventListener("click", start);
      video.addEventListener("click", function () {
        if (!video.currentSrc && !video.src) {
          start();
        }
      });
    });
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupLocalFilter();
    setupSearchPage();
    setupPlayers();
  });
})();
