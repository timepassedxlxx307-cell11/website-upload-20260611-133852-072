(function() {
    var menuButton = document.querySelector('[data-mobile-menu-button]');
    var mobileMenu = document.querySelector('[data-mobile-menu]');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('is-open');
        });
    }

    var carousel = document.querySelector('[data-hero-carousel]');

    if (carousel) {
        var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
        var activeIndex = 0;
        var timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }

            activeIndex = (index + slides.length) % slides.length;

            slides.forEach(function(slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === activeIndex);
            });

            dots.forEach(function(dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === activeIndex);
            });
        }

        function startTimer() {
            timer = window.setInterval(function() {
                showSlide(activeIndex + 1);
            }, 5200);
        }

        dots.forEach(function(dot) {
            dot.addEventListener('click', function() {
                window.clearInterval(timer);
                showSlide(Number(dot.getAttribute('data-hero-dot')));
                startTimer();
            });
        });

        showSlide(0);
        startTimer();
    }

    function normalize(value) {
        return String(value || '').trim().toLowerCase();
    }

    function applyFilter(scope) {
        var input = scope.querySelector('[data-filter-input]');
        var year = scope.querySelector('[data-filter-year]');
        var genre = scope.querySelector('[data-filter-genre]');
        var count = scope.querySelector('[data-filter-count]');
        var list = scope.parentElement.querySelector('[data-filter-list]') || document.querySelector('[data-filter-list]');

        if (!list) {
            return;
        }

        var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card'));

        function run() {
            var keyword = normalize(input && input.value);
            var selectedYear = normalize(year && year.value);
            var genreText = normalize(genre && genre.value);
            var visible = 0;

            cards.forEach(function(card) {
                var text = normalize([
                    card.getAttribute('data-title'),
                    card.getAttribute('data-genre'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-type'),
                    card.textContent
                ].join(' '));
                var cardYear = normalize(card.getAttribute('data-year'));
                var cardGenre = normalize(card.getAttribute('data-genre'));
                var matched = true;

                if (keyword && text.indexOf(keyword) === -1) {
                    matched = false;
                }

                if (selectedYear && cardYear !== selectedYear) {
                    matched = false;
                }

                if (genreText && cardGenre.indexOf(genreText) === -1 && text.indexOf(genreText) === -1) {
                    matched = false;
                }

                card.classList.toggle('is-hidden-card', !matched);

                if (matched) {
                    visible += 1;
                }
            });

            if (count) {
                count.textContent = '显示 ' + visible + ' 部影片';
            }
        }

        if (input) {
            input.addEventListener('input', run);
        }

        if (year) {
            year.addEventListener('change', run);
        }

        if (genre) {
            genre.addEventListener('input', run);
        }

        var params = new URLSearchParams(window.location.search);
        var query = params.get('q');

        if (query && input) {
            input.value = query;
        }

        run();
    }

    Array.prototype.slice.call(document.querySelectorAll('[data-filter-scope]')).forEach(applyFilter);
}());
