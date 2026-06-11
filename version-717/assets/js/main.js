(function () {
    function ready(callback) {
        if (document.readyState !== "loading") {
            callback();
            return;
        }
        document.addEventListener("DOMContentLoaded", callback);
    }

    function normalize(value) {
        return String(value || "").trim().toLowerCase();
    }

    function setupMenu() {
        var toggle = document.querySelector("[data-menu-toggle]");
        var nav = document.querySelector("[data-site-nav]");
        if (!toggle || !nav) {
            return;
        }
        toggle.addEventListener("click", function () {
            nav.classList.toggle("is-open");
        });
    }

    function setupHero() {
        var carousel = document.querySelector("[data-hero-carousel]");
        if (!carousel) {
            return;
        }
        var slides = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-dots] button"));
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
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                if (timer) {
                    window.clearInterval(timer);
                }
                show(index);
                start();
            });
        });

        if (slides.length > 1) {
            start();
        }
    }

    function setupFilters() {
        var scopes = Array.prototype.slice.call(document.querySelectorAll("[data-filter-scope]"));
        scopes.forEach(function (scope) {
            var input = scope.querySelector("[data-filter-input]");
            var year = scope.querySelector("[data-filter-year]");
            var type = scope.querySelector("[data-filter-type]");
            var empty = scope.querySelector("[data-empty-state]");
            var grid = scope.nextElementSibling ? scope.nextElementSibling.querySelector("[data-card-grid]") : document.querySelector("[data-card-grid]");
            if (!grid) {
                return;
            }
            var cards = Array.prototype.slice.call(grid.querySelectorAll("[data-movie-card]"));

            function apply() {
                var keyword = normalize(input ? input.value : "");
                var selectedYear = normalize(year ? year.value : "");
                var selectedType = normalize(type ? type.value : "");
                var visible = 0;
                cards.forEach(function (card) {
                    var haystack = normalize([
                        card.getAttribute("data-title"),
                        card.getAttribute("data-region"),
                        card.getAttribute("data-type"),
                        card.getAttribute("data-tags"),
                        card.getAttribute("data-year")
                    ].join(" "));
                    var matchesKeyword = !keyword || haystack.indexOf(keyword) !== -1;
                    var matchesYear = !selectedYear || normalize(card.getAttribute("data-year")) === selectedYear;
                    var matchesType = !selectedType || normalize(card.getAttribute("data-type")) === selectedType;
                    var showCard = matchesKeyword && matchesYear && matchesType;
                    card.classList.toggle("is-hidden", !showCard);
                    if (showCard) {
                        visible += 1;
                    }
                });
                if (empty) {
                    empty.classList.toggle("is-active", visible === 0);
                }
            }

            [input, year, type].forEach(function (control) {
                if (control) {
                    control.addEventListener("input", apply);
                    control.addEventListener("change", apply);
                }
            });

            var params = new URLSearchParams(window.location.search);
            var query = params.get("q");
            if (query && input) {
                input.value = query;
            }
            apply();
        });
    }

    ready(function () {
        setupMenu();
        setupHero();
        setupFilters();
    });
})();
