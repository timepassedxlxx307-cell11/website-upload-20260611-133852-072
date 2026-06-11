(function () {
  function initPlayer(video) {
    var source = video.getAttribute('data-stream') || '';
    var shell = video.closest('.player-shell');
    var button = shell ? shell.querySelector('.video-play-button') : null;
    var hlsInstance = null;

    if (source) {
      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.ERROR, function (eventName, data) {
          if (!data || !data.fatal) {
            return;
          }
          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            hlsInstance.startLoad();
          } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            hlsInstance.recoverMediaError();
          } else {
            hlsInstance.destroy();
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else {
        video.src = source;
      }
    }

    function playOrPause() {
      if (video.paused) {
        video.play().catch(function () {});
      } else {
        video.pause();
      }
    }

    if (button) {
      button.addEventListener('click', playOrPause);
    }
    video.addEventListener('click', function (event) {
      if (event.target === video) {
        playOrPause();
      }
    });
    video.addEventListener('play', function () {
      if (button) {
        button.classList.add('is-hidden');
      }
    });
    video.addEventListener('pause', function () {
      if (button) {
        button.classList.remove('is-hidden');
      }
    });
    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.slice.call(document.querySelectorAll('.movie-player')).forEach(initPlayer);
  });
}());
