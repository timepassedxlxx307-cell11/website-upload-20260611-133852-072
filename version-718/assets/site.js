(function () {
    var menuButton = document.querySelector("[data-menu-button]");
    var mobileNav = document.querySelector("[data-mobile-nav]");

    if (menuButton && mobileNav) {
        menuButton.addEventListener("click", function () {
            mobileNav.classList.toggle("open");
        });
    }

    var hero = document.querySelector("[data-hero]");

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
        var current = 0;
        var timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("active", dotIndex === current);
            });
        }

        function startTimer() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                showSlide(index);
                startTimer();
            });
        });

        showSlide(0);
        startTimer();
    }

    var redirectForms = document.querySelectorAll("[data-search-form]");

    redirectForms.forEach(function (form) {
        form.addEventListener("submit", function (event) {
            var input = form.querySelector("input[name='q']");
            if (!input || !input.value.trim()) {
                return;
            }
            event.preventDefault();
            window.location.href = "./search.html?q=" + encodeURIComponent(input.value.trim());
        });
    });

    var filterInput = document.querySelector("[data-filter-input]");
    var yearFilter = document.querySelector("[data-year-filter]");
    var typeFilter = document.querySelector("[data-type-filter]");
    var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card[data-search-text]"));
    var emptyState = document.querySelector("[data-empty-state]");

    if (filterInput && cards.length) {
        var params = new URLSearchParams(window.location.search);
        var query = params.get("q");
        if (query) {
            filterInput.value = query;
        }
    }

    function applyFilters() {
        var keyword = filterInput ? filterInput.value.trim().toLowerCase() : "";
        var year = yearFilter ? yearFilter.value : "";
        var type = typeFilter ? typeFilter.value : "";
        var visible = 0;

        cards.forEach(function (card) {
            var text = (card.getAttribute("data-search-text") || "").toLowerCase();
            var cardYear = card.getAttribute("data-year") || "";
            var cardType = card.getAttribute("data-type") || "";
            var matched = true;

            if (keyword && text.indexOf(keyword) === -1) {
                matched = false;
            }
            if (year && cardYear !== year) {
                matched = false;
            }
            if (type && cardType !== type) {
                matched = false;
            }

            card.style.display = matched ? "" : "none";
            if (matched) {
                visible += 1;
            }
        });

        if (emptyState) {
            emptyState.classList.toggle("show", visible === 0);
        }
    }

    [filterInput, yearFilter, typeFilter].forEach(function (control) {
        if (control) {
            control.addEventListener("input", applyFilters);
            control.addEventListener("change", applyFilters);
        }
    });

    if (cards.length) {
        applyFilters();
    }
})();
