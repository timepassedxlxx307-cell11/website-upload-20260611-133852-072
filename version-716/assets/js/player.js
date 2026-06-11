
(function () {
    window.initMoviePlayer = function (sourceUrl) {
        const video = document.getElementById('movie-player');
        const startButton = document.getElementById('player-start');
        const frame = document.querySelector('.video-frame');
        let loaded = false;
        let hls = null;

        if (!video || !startButton || !frame || !sourceUrl) {
            return;
        }

        function loadVideo() {
            if (loaded) {
                return;
            }

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = sourceUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                hls.loadSource(sourceUrl);
                hls.attachMedia(video);
            } else {
                video.src = sourceUrl;
            }

            loaded = true;
        }

        function beginPlay() {
            loadVideo();
            frame.classList.add('is-playing');
            const playTask = video.play();

            if (playTask && typeof playTask.catch === 'function') {
                playTask.catch(function () {
                    frame.classList.remove('is-playing');
                });
            }
        }

        startButton.addEventListener('click', function (event) {
            event.preventDefault();
            beginPlay();
        });

        frame.addEventListener('click', function (event) {
            if (event.target === startButton || startButton.contains(event.target)) {
                return;
            }

            if (!frame.classList.contains('is-playing') || video.paused) {
                beginPlay();
            }
        });

        video.addEventListener('play', function () {
            frame.classList.add('is-playing');
        });

        video.addEventListener('ended', function () {
            frame.classList.remove('is-playing');
        });

        window.addEventListener('pagehide', function () {
            if (hls) {
                hls.destroy();
                hls = null;
            }
        });
    };
})();
