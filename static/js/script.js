$(document).ready(function(){
    jsPlumb.Defaults.Container($('#container'));
    jsPlumb.draggable($('#container *'));


    recordingSetup();
});

var audio_context;
var recorder;

function startUserMedia(stream) {
    var input = audio_context.createMediaStreamSource(stream);
    var zeroGain = audio_context.createGain();
    zeroGain.gain.value = 0;
    input.connect(zeroGain);
    zeroGain.connect(audio_context.destination);
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

  

    recorder.clear();
}

function createDownloadLink() {
    recorder && recorder.exportWAV(function(blob) {
    	jQuery.ajax({
    		url: '/upload/',
    		type: 'POST',
    		data: {
    			audio: blob
    		},
    		success: function(content){
    		}
    });
}

function recordingSetup() {

	audio_context = new webkitAudioContext()

	//Compatibility
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;

	var btnStart = document.getElementById("btnStart"),
		btnStop = document.getElementById("btnStop");

	navigator.getUserMedia({audio: true}, startUserMedia);

	btnStart.addEventListener("click", startRecording);
	btnStop.addEventListener('click', stopRecording);
}

