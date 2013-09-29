$(document).ready(function(){
    $('h1').click(function() {
        $(this).toggleClass('red');
    });

    recordingSetup();
});

function onFailSoHard(e) {
    console.log('Rejected!', e);
};

var audio_context;
var recorder;

function startUserMedia(stream) {
    var input = audio_context.createMediaStreamSource(stream);
    input.connect(audio_context.destination);
    recorder = new Recorder(input);
}

function startRecording() {
    recorder && recorder.record();
    this.disabled = true;
    this.nextElementSibling.disabled = false;
}

function stopRecording() {
    recorder && recorder.stop();
    this.disabled = true;
    this.previousElementSibling.disabled = false;

    // create WAV download link using audio data blob
    createDownloadLink();

    recorder.clear();
}

function createDownloadLink() {
    recorder && recorder.exportWAV(function(blob) {
        var url = URL.createObjectURL(blob);
        var recordingslist = $('#recordingslist');
        var li = document.createElement('li');
        var au = document.createElement('audio');
        var hf = document.createElement('a');

        au.controls = true;
        au.src = url;
        hf.href = url;
        hf.download = new Date().toISOString() + '.wav';
        hf.innerHTML = hf.download;
        li.appendChild(au);
        li.appendChild(hf);
        recordingslist.append(li);
    });
}

function recordingSetup() {
    window.onload = function() {

        audio_context = new webkitAudioContext()

        //Compatibility
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;

        var canvas = document.getElementById("canvas"),
            context = canvas.getContext("2d"),
            btnStart = document.getElementById("btnStart"),
            btnStop = document.getElementById("btnStop"),
            btnPhoto = document.getElementById("btnPhoto"),
            audioObj = {
                video: false,
                audio: true
            };

        if (navigator.getUserMedia) {
            navigator.getUserMedia(audioObj, startUserMedia);
        }

        btnStart.addEventListener("click", startRecording);
        btnStop.addEventListener('click', stopRecording);
    }
}

function hasGetUserMedia() {
    // Note: Opera is unprefixed.
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia);
}
