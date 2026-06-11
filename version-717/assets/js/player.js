(function () {
    function initializeVideoPlayer(source) {
        var player = document.querySelector("[data-player]");
        if (!player || !source) {
            return;
        }
        var video = player.querySelector("video");
        var overlay = player.querySelector("[data-play-overlay]");
        var hls = null;
        var isReady = false;

        function attach() {
            if (isReady || !video) {
                return;
            }
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(source);
                hls.attachMedia(video);
            } else {
                video.src = source;
            }
            video.controls = true;
            isReady = true;
        }

        function play() {
            attach();
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
            var result = video.play();
            if (result && typeof result.catch === "function") {
                result.catch(function () {});
            }
        }

        if (overlay) {
            overlay.addEventListener("click", play);
        }
        if (video) {
            video.addEventListener("click", function () {
                if (video.paused) {
                    play();
                }
            });
        }
        window.addEventListener("beforeunload", function () {
            if (hls) {
                hls.destroy();
            }
        });
    }

    window.initializeVideoPlayer = initializeVideoPlayer;
})();
