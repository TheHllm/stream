var video;
var ws;
var videoId;
var ignoreStateChange = false;


function getVideoState(){
    return {
        starttime: new Date().getTime(),
        time: video.currentTime,
        playbackRate: video.playbackRate,
        paused: video.paused,
    }
}

function setVideoState(data){
    ignoreStateChange = true;
    setTimeout(function (){
    video.playbackRate = data.playbackRate;
    var time = data.time + ((new Date().getTime()) - data.starttime)/1000 * data.playbackRate * (data.paused ? 0 : 1);
    
    video.currentTime = time;
    if(data.paused){
        console.log("pause");
        video.pause();
    }else{
        console.log("play");
        video.play();
    }

    },100);


    setTimeout(function (){ignoreStateChange = false}, 200);
    
}


function onStateChange(){
    if(ignoreStateChange === false){
        console.log("stateChanged");

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