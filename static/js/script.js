$(document).ready(function(){
    // setup jsPlumb defaults.
    jsPlumb.importDefaults({
        HoverClass : "dropHover", 
        DragOptions : { cursor: 'pointer', zIndex:2000 },
        PaintStyle : { strokeStyle:'#666' },
        EndpointStyle : { width:20, height:16, strokeStyle:'#666' },
        Endpoint : "Rectangle",
        Anchors : ["Left", "Right"],
        Container : "container"
    });

    // jsPlumb.Defaults.Container = $('#container');
    
    var index = 1;
    $('.new-node').click(function(e) {
        $(".greeting").fadeTo(200,0);
        e.preventDefault(index);
        index += 1;
    });                                             

    // bind to connection/connectionDetached events, and update the list of connections on screen.
    jsPlumb.bind("connection", function(info, originalEvent) {
        updateConnections(info.connection);
        console.log("connected");
    });
    
    jsPlumb.bind("connectionDetached", function(info, originalEvent) {
        updateConnections(info.connection, true);
        console.log("disconnected")
    });

    var audio_context;
    var recorder;

    // recordingSetup();
});

var createNode = function(index) {
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

    // configure some drop options for use by all endpoints.
    var dropOptions = {
        tolerance:"touch",
        hoverClass:"dropHover",
        activeClass:"dragActive"
    };

    var color2 = "#316b31";
    var endpoint = {
        endpoint:["Dot", { radius:11 }],
        paintStyle:{ fillStyle:color2 },
        isSource:true,
        scope:"green dot",
        connectorStyle:{ strokeStyle:color2, lineWidth:6 },
        connector: ["Flowchart", { cornerRadius:10 } ],
        isTarget:true,
        maxConnections: 10,
        dropOptions : dropOptions
    };
    var e1 = jsPlumb.addEndpoint(id, { anchor: [1, 0.5, 1, 0]}, endpoint);
    var e2 = jsPlumb.addEndpoint(id, { anchor: [0, 0.5, -1, 0]}, endpoint)
}


var blink = function(){
    console.log("blinkin'");
    $('.icon-circle-empty').delay(200).fadeTo(200,0.5).delay(200).fadeTo(200,1, blink);
}

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
        btnStart.addEventListener("click", startRecording);
        btnStop.addEventListener('click', stopRecording);
    };
});
