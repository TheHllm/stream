var ignoreNextStateChange = false;
var ignoreNextStateChangeResetTimeout;
var videoReady = false;
var lastMessage = undefined;


function getVideoState(){
    return {
        type: "TODO",
        starttime: new Date().getTime(),
        time: video.currentTime,
        playbackRate: video.speed,
        paused: video.paused,
    }
}

function setVideoState(data){
    lastMessage = data;
    if(!videoReady){
        return;
    }
    lastMessage.executed = true;

    clearTimeout(ignoreNextStateChangeResetTimeout);
    ignoreNextStateChange = true;
    console.log("setting state ignore:" + ignoreNextStateChange);
    video.speed = data.playbackRate;
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
    }else if(!videoReady){
        console.log("not ready");
        return;
    }else if(ws.readyState === 1){
        console.log("onStateChanged... sending message");
        blipSelf();
        //send video state
        sendVideoState();
    }
}

function onVideoReady(){
    console.log("i am ready now");
    videoReady = true;
    if(lastMessage !== undefined && !(lastMessage.executed && lastMessage.executed === true)){
        setVideoState(lastMessage);
    }
}



window.onload = function (){
    userListElm = document.getElementById('user-list');
    chatWindow = document.getElementById("chat-window");

    chatInput = document.getElementById('chat-input');
    document.getElementById('chat-form').addEventListener('submit', sendChatMessage);

    if(!video.ready){
        video.on("ready", onVideoReady);
    }else{
        this.videoReady = true;
    }

    var events = ["pause", "playing", "seeked", "ratechange"];
    for(var i = 0; i < events.length; i++){
        video.on(events[i], onStateChange);
    }

    crateWebsocket();
}
