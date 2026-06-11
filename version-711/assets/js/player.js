(function () {
    window.initMoviePlayer = function (source, videoId, buttonId) {
        var video = document.getElementById(videoId);
        var button = document.getElementById(buttonId);
        var hls = null;
        var ready = false;

        if (!video || !source) {
            return;
        }

        function attachSource() {
            if (ready) {
                return;
            }
            ready = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    maxBufferLength: 40,
                    capLevelToPlayerSize: true
                });
                hls.loadSource(source);
                hls.attachMedia(video);
            } else {
                video.src = source;
            }
        }

        function startPlayback() {
            attachSource();
            if (button) {
                button.classList.add('is-hidden');
            }
            video.controls = true;
            var playTask = video.play();
            if (playTask && playTask.catch) {
                playTask.catch(function () {
                    if (button) {
                        button.classList.remove('is-hidden');
                    }
                });
            }
        }

        if (button) {
            button.addEventListener('click', startPlayback);
        }

        video.addEventListener('click', function () {
            if (video.paused) {
                startPlayback();
            }
        });

        video.addEventListener('play', function () {
            if (button) {
                button.classList.add('is-hidden');
            }
        });

        video.addEventListener('pause', function () {
            if (button && video.currentTime === 0) {
                button.classList.remove('is-hidden');
            }
        });

        window.addEventListener('pagehide', function () {
            if (hls) {
                hls.destroy();
                hls = null;
            }
        });
    };
})();
