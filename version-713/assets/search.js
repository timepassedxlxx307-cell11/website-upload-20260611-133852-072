(function () {
  function getQuery() {
    var params = new URLSearchParams(window.location.search);
    return (params.get('q') || '').trim();
  }

  function textOf(item) {
    return [item.title, item.category, item.year, item.region, item.type, item.genre, item.desc, (item.tags || []).join(' ')].join(' ').toLowerCase();
  }

  function renderCard(item) {
    var tags = (item.tags || []).slice(0, 4).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');
    return '<article class="movie-card">' +
      '<a class="poster-link" href="' + item.url + '" aria-label="观看' + escapeHtml(item.title) + '">' +
      '<div class="poster-wrap">' +
      '<img src="./' + item.image + '" alt="' + escapeHtml(item.title) + '" loading="lazy">' +
      '<span class="poster-category">' + escapeHtml(item.category) + '</span>' +
      '<span class="poster-play">▶</span>' +
      '</div>' +
      '<div class="card-body">' +
      '<h3>' + escapeHtml(item.title) + '</h3>' +
      '<p class="card-meta">' + escapeHtml([item.year, item.region, item.type].filter(Boolean).join(' · ')) + '</p>' +
      '<p class="card-desc">' + escapeHtml(item.desc || '') + '</p>' +
      '<div class="card-tags">' + tags + '</div>' +
      '</div>' +
      '</a>' +
      '</article>';
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"]/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
      }[char];
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var query = getQuery();
    var results = document.getElementById('search-results');
    var empty = document.getElementById('search-empty');
    var hot = document.getElementById('hot-search');
    var inputs = Array.prototype.slice.call(document.querySelectorAll('input[name="q"]'));
    inputs.forEach(function (input) {
      input.value = query;
    });
    if (!results || !query) {
      return;
    }
    var words = query.toLowerCase().split(/\s+/).filter(Boolean);
    var matches = MOVIE_SEARCH_ITEMS.filter(function (item) {
      var text = textOf(item);
      return words.every(function (word) {
        return text.indexOf(word) !== -1;
      });
    }).slice(0, 120);
    results.innerHTML = matches.map(renderCard).join('');
    if (empty) {
      empty.hidden = matches.length > 0;
    }
    if (hot) {
      hot.hidden = matches.length > 0;
    }
  });
}());
