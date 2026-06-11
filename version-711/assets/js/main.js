(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    document.querySelectorAll('[data-hero]').forEach(function (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === index);
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
            }
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                show(dotIndex);
                start();
            });
        });

        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                start();
            });
        }

        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        show(0);
        start();
    });

    document.querySelectorAll('[data-filter-scope]').forEach(function (scope) {
        var input = scope.querySelector('[data-search-input]');
        var buttons = Array.prototype.slice.call(scope.querySelectorAll('[data-filter]'));
        var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-movie-card]'));
        var empty = scope.querySelector('[data-empty-state]');
        var active = '';

        function apply() {
            var query = input ? input.value.trim().toLowerCase() : '';
            var visible = 0;

            cards.forEach(function (card) {
                var bag = [
                    card.dataset.title,
                    card.dataset.tags,
                    card.dataset.year,
                    card.dataset.region,
                    card.dataset.type,
                    card.dataset.genre
                ].join(' ').toLowerCase();
                var okQuery = !query || bag.indexOf(query) !== -1;
                var okFilter = !active || bag.indexOf(active.toLowerCase()) !== -1;
                var showCard = okQuery && okFilter;
                card.hidden = !showCard;
                if (showCard) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle('is-visible', visible === 0);
            }
        }

        if (input) {
            input.addEventListener('input', apply);
        }

        buttons.forEach(function (button) {
            button.addEventListener('click', function () {
                active = button.dataset.filter || '';
                buttons.forEach(function (item) {
                    item.classList.toggle('is-active', item === button);
                });
                apply();
            });
        });

        apply();
    });
})();
