$(document).ready(function(){
    jsPlumb.importDefaults({
        DragOptions : { cursor: "pointer", zIndex:2000 },
        HoverClass:"connector-hover"
    });

    recordingSetup();

    jsPlumb.Defaults.Container = $('#container');
    jsPlumb.draggable(jsPlumb.getSelector(".node"));

    var index = 2;
    var previous = "node1";
    $('.new-node').click(function(e) {
        e.preventDefault();
        var id = "node" + index;
        console.log("Test.");
        $('#container').append(
            $("<div>", {
                "class": "node",
                id: id
            }).append(
                $("<input>", {
                    type: "text",
                    placeholder: "Title"
                }),
                $("<div>", {
                    "class": "size"
                }).append(
                    $("<a>", {
                        href: "#"
                    }).append(
                        $("<div>", {
                            "class": "play-node icon-play"
                        })
                    )
                )
            )
        );
        jsPlumb.draggable(id);

        var common = {
            cssClass:"myCssClass"
        };
        jsPlumb.connect({
            source: previous,
            target: id,
            anchor:[ "Continuous", { faces:["top","bottom"] }],
            endpoint:[ "Dot", { radius:5, hoverClass:"myEndpointHover" }, common ],
            connector:[ "Bezier", { curviness:100 }, common ],
            overlays: [
                [ "Arrow", { foldback:0.2 }, common ]    
            ]
        });

        previous = id;
        index = index + 1;
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
    };

    function startRecording() {
        recorder && recorder.record();
        this.disabled = true;
        this.nextElementSibling.disabled = false;
    };

    function stopRecording() {
        recorder && recorder.stop();
        this.disabled = true;
        this.previousElementSibling.disabled = false;

        recorder && recorder.exportWAV(function(blob) {
    /*        console.log(blob);
            $('userfile').val(blob);
            $.ajaxFileUpload({
                url: "../ajax/saverecording/", 
                secureuri: false,
                fileElementId: 'userfile',
                dataType: blob.type,
                data: blob,
                success: function(data, status) {
                    if(data.status != 'error')
                        alert("hoera!");
                    alert(data.msg);
                }
            });
            */

            var fd = new FormData();
            fd.append('audio', blob);
            $.ajax({
                url: '/upload',
                type: 'POST',
                data: fd,
                processData: false,
                contentType: false
            }).done(function(data) {
                console.log(data);
            });
        });
        recorder.clear();
    };

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
});
