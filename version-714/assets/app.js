(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
            return;
        }
        callback();
    }

    function setupMenu() {
        var button = document.querySelector("[data-menu-button]");
        if (!button) {
            return;
        }
        button.addEventListener("click", function () {
            document.body.classList.toggle("menu-open");
        });
        document.querySelectorAll(".main-nav a").forEach(function (link) {
            link.addEventListener("click", function () {
                document.body.classList.remove("menu-open");
            });
        });
    }

    function setupHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        if (slides.length < 2) {
            return;
        }
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
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
                show(Number(dot.getAttribute("data-hero-dot") || 0));
                start();
            });
        });
        hero.addEventListener("mouseenter", stop);
        hero.addEventListener("mouseleave", start);
        show(0);
        start();
    }

    function setupFilters() {
        var cards = Array.prototype.slice.call(document.querySelectorAll("[data-filter-card]"));
        if (!cards.length) {
            return;
        }
        var input = document.querySelector("[data-search-input]");
        var year = document.querySelector("[data-year-filter]");
        var region = document.querySelector("[data-region-filter]");
        var genre = document.querySelector("[data-genre-filter]");

        function getValue(element) {
            return element ? element.value.trim().toLowerCase() : "";
        }

        function apply() {
            var keyword = getValue(input);
            var yearValue = getValue(year);
            var regionValue = getValue(region);
            var genreValue = getValue(genre);
            cards.forEach(function (card) {
                var text = [
                    card.getAttribute("data-title"),
                    card.getAttribute("data-year"),
                    card.getAttribute("data-region"),
                    card.getAttribute("data-genre"),
                    card.getAttribute("data-tags")
                ].join(" ").toLowerCase();
                var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
                var matchYear = !yearValue || String(card.getAttribute("data-year") || "").toLowerCase().indexOf(yearValue) !== -1;
                var matchRegion = !regionValue || String(card.getAttribute("data-region") || "").toLowerCase().indexOf(regionValue) !== -1;
                var matchGenre = !genreValue || String(card.getAttribute("data-genre") || "").toLowerCase().indexOf(genreValue) !== -1 || String(card.getAttribute("data-tags") || "").toLowerCase().indexOf(genreValue) !== -1;
                card.classList.toggle("is-hidden", !(matchKeyword && matchYear && matchRegion && matchGenre));
            });
        }

        [input, year, region, genre].forEach(function (element) {
            if (element) {
                element.addEventListener("input", apply);
                element.addEventListener("change", apply);
            }
        });
    }

    window.activateMoviePlayer = function (videoId, buttonId, streamUrl) {
        var video = document.getElementById(videoId);
        var button = document.getElementById(buttonId);
        if (!video || !button || !streamUrl) {
            return;
        }
        var loaded = false;
        var hlsInstance = null;

        function load() {
            if (loaded) {
                return;
            }
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = streamUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: false
                });
                hlsInstance.loadSource(streamUrl);
                hlsInstance.attachMedia(video);
            } else {
                video.src = streamUrl;
            }
            loaded = true;
        }

        function begin(event) {
            if (event && typeof event.preventDefault === "function") {
                event.preventDefault();
            }
            load();
            button.classList.add("is-hidden");
            video.controls = true;
            var action = video.play();
            if (action && typeof action.catch === "function") {
                action.catch(function () {
                    button.classList.remove("is-hidden");
                });
            }
        }

        button.addEventListener("click", begin);
        video.addEventListener("click", function () {
            if (video.paused) {
                begin();
            }
        });
        video.addEventListener("play", function () {
            button.classList.add("is-hidden");
        });
        video.addEventListener("ended", function () {
            if (hlsInstance && typeof hlsInstance.stopLoad === "function") {
                hlsInstance.stopLoad();
            }
        });
    };

    ready(function () {
        setupMenu();
        setupHero();
        setupFilters();
    });
}());
