(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function createResult(item) {
    var link = document.createElement("a");
    link.className = "search-result";
    link.href = "./" + item.file;

    var img = document.createElement("img");
    img.src = item.cover;
    img.alt = item.title;
    img.loading = "lazy";

    var box = document.createElement("span");
    var title = document.createElement("strong");
    title.textContent = item.title;
    var meta = document.createElement("span");
    meta.textContent = item.region + " · " + item.year + " · " + item.type;

    box.appendChild(title);
    box.appendChild(meta);
    link.appendChild(img);
    link.appendChild(box);
    return link;
  }

  function initMenu() {
    var toggle = document.querySelector("[data-toggle-menu]");
    var menu = document.getElementById("site-menu");
    if (!toggle || !menu) {
      return;
    }
    toggle.addEventListener("click", function () {
      menu.classList.toggle("is-open");
    });
  }

  function initHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }

    function restart() {
      if (timer) {
        clearInterval(timer);
      }
      timer = setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        restart();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        restart();
      });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
        restart();
      });
    });
    show(0);
    restart();
  }

  function initSearch() {
    var forms = Array.prototype.slice.call(document.querySelectorAll("[data-search-form]"));
    var items = window.movieSearchItems || [];
    forms.forEach(function (form) {
      var input = form.querySelector("[data-search-input]");
      var panel = form.querySelector("[data-search-panel]");
      if (!input || !panel) {
        return;
      }

      function render() {
        var query = input.value.trim().toLowerCase();
        panel.textContent = "";
        if (!query) {
          panel.classList.remove("is-open");
          return;
        }
        var matches = items.filter(function (item) {
          return item.search.includes(query);
        }).slice(0, 12);
        if (!matches.length) {
          var empty = document.createElement("div");
          empty.className = "search-result";
          empty.textContent = "暂无匹配影片";
          panel.appendChild(empty);
        } else {
          matches.forEach(function (item) {
            panel.appendChild(createResult(item));
          });
        }
        panel.classList.add("is-open");
      }

      input.addEventListener("input", render);
      input.addEventListener("focus", render);
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var first = panel.querySelector("a");
        if (first) {
          window.location.href = first.href;
        }
      });
      document.addEventListener("click", function (event) {
        if (!form.contains(event.target)) {
          panel.classList.remove("is-open");
        }
      });
    });
  }

  function initFilters() {
    var input = document.querySelector("[data-filter-input]");
    var chips = Array.prototype.slice.call(document.querySelectorAll("[data-filter-chip]"));
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));
    var active = "all";
    if (!input && !chips.length) {
      return;
    }

    function apply() {
      var query = input ? input.value.trim().toLowerCase() : "";
      cards.forEach(function (card) {
        var haystack = (card.getAttribute("data-search-text") || "").toLowerCase();
        var region = card.getAttribute("data-region") || "";
        var matchQuery = !query || haystack.includes(query);
        var matchChip = active === "all" || region.indexOf(active) > -1 || haystack.indexOf(active.toLowerCase()) > -1;
        card.classList.toggle("is-hidden", !(matchQuery && matchChip));
      });
    }

    if (input) {
      input.addEventListener("input", apply);
    }
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        active = chip.getAttribute("data-filter-chip") || "all";
        chips.forEach(function (item) {
          item.classList.toggle("is-active", item === chip);
        });
        apply();
      });
    });
    apply();
  }

  ready(function () {
    initMenu();
    initHero();
    initSearch();
    initFilters();
  });
})();

function initVideoPlayer(source) {
  var video = document.getElementById("movie-video");
  var trigger = document.getElementById("play-trigger");
  var loaded = false;
  var hlsInstance = null;

  function attach() {
    if (!video || loaded) {
      return;
    }
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
    } else if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new Hls({ enableWorker: true, lowLatencyMode: true });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
    } else {
      video.src = source;
    }
    loaded = true;
  }

  function play() {
    if (!video) {
      return;
    }
    attach();
    if (trigger) {
      trigger.classList.add("is-hidden");
    }
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {
        if (trigger) {
          trigger.classList.remove("is-hidden");
        }
      });
    }
  }

  if (trigger) {
    trigger.addEventListener("click", play);
  }
  if (video) {
    video.addEventListener("click", function () {
      if (video.paused) {
        play();
      }
    });
    video.addEventListener("play", function () {
      if (trigger) {
        trigger.classList.add("is-hidden");
      }
    });
    window.addEventListener("beforeunload", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }
}
