var video;
var ws;
var videoId;
var ignoreNextStateChange = false;
var ignoreNextStateChangeResetTimeout;


function getVideoState(){
    return {
        starttime: new Date().getTime(),
        time: video.currentTime,
        playbackRate: video.playbackRate,
        paused: video.paused,
    }
}

function setVideoState(data){
    clearTimeout(ignoreNextStateChangeResetTimeout);
    ignoreNextStateChange = true;
    console.log("setting state ignore:" + ignoreNextStateChange);
    video.playbackRate = data.playbackRate;
    var time = data.time + ((new Date().getTime()) - data.starttime)/1000 * data.playbackRate * (data.paused ? 0 : 1) + 1; //add 1 second to compensate for latency and loading times
    
    video.currentTime = time;
    if(data.paused){
        video.pause();
    }else{
        video.play();
    }
    
}


function onStateChange(e){
    if(ignoreNextStateChange){
        clearTimeout(ignoreNextStateChangeResetTimeout);
        ignoreNextStateChangeResetTimeout = setTimeout(function (){ignoreNextStateChange = false}, 500); // wait a bit before resetting this since one state change can trigger up to 4 events.
        console.log("resting ignore...");
    }else if(ws.readyState === 1){
        console.log(e);
        console.log("onStateChanged... sending message");

        //send video state
        var message = {
            type: 'update',
            state: getVideoState()
        };
        ws.send(JSON.stringify(message));
    }
}

function onMessage(data){   
    var message = JSON.parse(data.data);
    console.log("msg recived");
    setVideoState(message);
}


window.onload = function (){
    video = document.getElementById('video');
    videoId = video.dataset.video;
    var events = ["pause", "play", "seeked", "ratechange"];
    for(var i = 0; i < events.length; i++){
        video.addEventListener(events[i], onStateChange);
    }

    ws = new WebSocket("wss://stream.hllm.tk/wss");
    ws.onopen = function (){
        var msg = JSON.stringify({
            type: "join",
            video: videoId,
            state: getVideoState()
        });
        ws.send(msg);
    }

    ws.onmessage = onMessage;
}