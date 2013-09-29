$(document).ready(function(){
    jsPlumb.Defaults.Container = $('#container');
    jsPlumb.draggable($('#container *'));

    $('.new-clip').click(function() {
        console.log("Test.");
        $('#container').append(
            $("<div>", {
                "class": "node"
            }).append(
                $("<input>", {
                    type: "text",
                    placeholder: "Title"
                }),
                $("<div>", {
                    "class": "play-pause"
                })
            )
        );
    });

    var blink = function(){
    	console.log("blinkin'");
    	$('.icon-circle-empty').delay(200).fadeTo(200,0.5).delay(200).fadeTo(200,1, blink);
	}
	blink();


    var audio_context;
    var recorder;

    var startUserMedia = function(stream) {
        var input = audio_context.createMediaStreamSource(stream);
        var zeroGain = audio_context.createGain();
        zeroGain.gain.value = 0;
        input.connect(zeroGain);
        zeroGain.connect(audio_context.destination);
        recorder = new Recorder(input);
    };

    var startRecording = function() {
        recorder && recorder.record();
        this.disabled = true;
        this.nextElementSibling.disabled = false;
    };

    var stopRecording = function() {
        recorder && recorder.stop();
        this.disabled = true;
        this.previousElementSibling.disabled = false;

      

        recorder.clear();
    };

    var createDownloadLink = function() {
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
        });
    };

    var recordingSetup = function() {

        audio_context = new webkitAudioContext()

        //Compatibility
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;

        var btnStart = document.getElementById("btnStart"),
            btnStop = document.getElementById("btnStop");

        navigator.getUserMedia({audio: true}, startUserMedia);

        btnStart.addEventListener("click", startRecording);
        btnStop.addEventListener('click', stopRecording);
    };

    //recordingSetup();
});
