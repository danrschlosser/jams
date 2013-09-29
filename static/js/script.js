$(document).ready(function(){
    $('h1').click(function() {
        $(this).toggleClass('red');
    });

    recordingSetup();
});

function onFailSoHard(e) {
    console.log('Rejected!', e);
};

function recordingSetup() {
    window.onload = function() {

        //Compatibility
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;

        var canvas = document.getElementById("canvas"),
            context = canvas.getContext("2d"),
            audio = document.getElementById("audio"),
            btnStart = document.getElementById("btnStart"),
            btnStop = document.getElementById("btnStop"),
            btnPhoto = document.getElementById("btnPhoto"),
            audioObj = {
                video: false,
                audio: true
            };

        btnStart.addEventListener("click", function() {
            var localMediaStream;

            if (navigator.getUserMedia) {
                navigator.getUserMedia(audioObj, function(stream) {              
                    audio.src = (navigator.webkitGetUserMedia) ? window.webkitURL.createObjectURL(stream) : stream;
                    localMediaStream = stream;

                }, function(error) {
                    console.error("Video capture error: ", error.code);
                });

                btnStop.addEventListener("click", function() {
                    localMediaStream.stop();
                });
            }
        });
    };
}

function hasGetUserMedia() {
    // Note: Opera is unprefixed.
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia);
}
