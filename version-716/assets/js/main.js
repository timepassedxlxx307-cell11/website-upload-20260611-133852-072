
(function () {
    const menuButton = document.querySelector('.menu-toggle');
    const mobilePanel = document.querySelector('.mobile-panel');

    if (menuButton && mobilePanel) {
        menuButton.addEventListener('click', function () {
            const opened = mobilePanel.classList.toggle('is-open');
            menuButton.setAttribute('aria-expanded', opened ? 'true' : 'false');
            mobilePanel.setAttribute('aria-hidden', opened ? 'false' : 'true');
        });
    }

    const hero = document.querySelector('[data-hero]');

    if (hero) {
        const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
        const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
        let index = 0;
        let timer = null;

        function showSlide(nextIndex) {
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

        function startTimer() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                showSlide(index + 1);
            }, 5200);
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                const next = Number(dot.getAttribute('data-hero-dot')) || 0;
                showSlide(next);
                startTimer();
            });
        });

        showSlide(0);
        startTimer();
    }

    const catalogList = document.querySelector('[data-catalog-list]');
    const catalogSearch = document.querySelector('#catalog-search');
    const filterButtons = Array.from(document.querySelectorAll('.filter-button'));

    if (catalogList) {
        const cards = Array.from(catalogList.querySelectorAll('.movie-card'));
        const params = new URLSearchParams(window.location.search);
        const query = params.get('q') || '';

        if (catalogSearch && query) {
            catalogSearch.value = query;
        }

        function activeFilter() {
            const active = filterButtons.find(function (button) {
                return button.classList.contains('is-active');
            });

            return active ? active.getAttribute('data-filter') : 'all';
        }

        function cardMatchesFilter(card, filter) {
            if (!filter || filter === 'all') {
                return true;
            }

            return card.getAttribute('data-collection') === filter ||
                card.getAttribute('data-region') === filter ||
                card.getAttribute('data-type') === filter;
        }

        function applyCatalog() {
            const keyword = catalogSearch ? catalogSearch.value.trim().toLowerCase() : '';
            const filter = activeFilter();

            cards.forEach(function (card) {
                const text = (card.getAttribute('data-search') || '').toLowerCase();
                const visible = (!keyword || text.indexOf(keyword) !== -1) && cardMatchesFilter(card, filter);
                card.classList.toggle('is-hidden', !visible);
            });
        }

        if (catalogSearch) {
            catalogSearch.addEventListener('input', applyCatalog);
        }

        filterButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                filterButtons.forEach(function (item) {
                    item.classList.remove('is-active');
                });
                button.classList.add('is-active');
                applyCatalog();
            });
        });

        const catalogForm = document.querySelector('[data-catalog-form]');

        if (catalogForm) {
            catalogForm.addEventListener('submit', function (event) {
                event.preventDefault();
                applyCatalog();
            });
        }

        applyCatalog();
    }
})();
