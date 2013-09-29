window.shouldKeepBlinking = true;

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

    recordingSetup();

    // jsPlumb.Defaults.Container = $('#container');
    
    var index = 1;
    $('.new-node').click(function(e) {
        e.preventDefault(index);
        $(".greeting").fadeTo(400,0);
        var id = createNode(index);
        startRecording();
        index += 1;
        stopRecording(id);
    });                                             

    $(document).on("click", '.icon-circle-empty', function(e) {
    	e.preventDefault();
    	window.shouldKeepBlinking = false;
    });
    // bind to connection/connectionDetached events and update the list of connections on screen
    jsPlumb.bind("connection", function(info, originalEvent) {
        updateConnections(info.connection);
        console.log("connected");
    });
    
    jsPlumb.bind("connectionDetached", function(info, originalEvent) {
        updateConnections(info.connection, true);
        console.log("disconnected")
    });
});

var audio_context;
var recorder;

var createNode = function(index) {
    var id = "node" + index;
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
                        "class": "play-node icon-circle-empty"
                    })
                )
            )
        )
    );
    blink(id);

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
    var e2 = jsPlumb.addEndpoint(id, { anchor: [0, 0.5, -1, 0]}, endpoint);

    return id;
}



var blink = function(id){
    console.log("blinkin'");
    $('#' + id + ' .icon-circle-empty').delay(200).fadeTo(200,0.5).delay(200).fadeTo(200,1, function(){
    	console.log(window.shouldKeepBlinking);
    	if (window.shouldKeepBlinking) {
    		blink(id);
    	} else {
    		window.shouldKeepBlinking = true;
    		$(this).removeClass("icon-circle-empty").addClass("icon-play");
    	}
    });
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
};

var stopRecording = function(id) {
    recorder.stop();

    recorder.exportWAV(function(blob) {
        var fd = new FormData();
        fd.append('audio', blob);
        $.ajax({
            url: '/upload',
            type: 'POST',
            data: fd,
            processData: false,
            contentType: false
        }).done(function(data) {
            $('#' + id).attr('data-id', data);
        });
    });
    recorder.clear();
};

var recordingSetup = function() {

    audio_context = new webkitAudioContext()

    //Compatibility
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
    navigator.getUserMedia({audio: true}, startUserMedia);
};
