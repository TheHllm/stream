var video;
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
    var time = data.time + ((new Date().getTime()) - data.starttime)/1000 * data.playbackRate * (data.paused ? 0 : 1);
    
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
        console.log("onStateChanged... sending message");
        blipSelf();
        //send video state
        var message = {
            type: 'update',
            state: getVideoState(),
            name: name
        };
        ws.send(JSON.stringify(message));


    }
}



window.onload = function (){
    userListElm = document.getElementById('user-list');
    chatWindow = document.getElementById("chat-window");

    video = document.getElementById('video');
    videoId = video.dataset.video;

    chatInput = document.getElementById('chat-input');
    document.getElementById('chat-form').addEventListener('submit', sendChatMessage);

    var events = ["pause", "play", "seeked", "ratechange"];
    for(var i = 0; i < events.length; i++){
        video.addEventListener(events[i], onStateChange);
    }

    crateWebsocket();
}
