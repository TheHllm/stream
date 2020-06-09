var video;
var ws;
var videoId;
var ignoreNextStateChange = false;
var ignoreNextStateChangeResetTimeout;
var userListElm;
var name;
var userNameToElmMap = new Map();
var lastUpdaterElm;


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

        //send video state
        var message = {
            type: 'update',
            state: getVideoState(),
            name: name
        };
        ws.send(JSON.stringify(message));
    }
}

function onMessage(data){   
    var message = JSON.parse(data.data);
    if(typeof message.type !== "undefined" && message.type=='ping'){
        //ignore
        return;
    }
    
    lastUpdater.innerText = message.lastUpdater;
    setVideoState(message);
    setUserState(message);
}

function setUserState(msg){
    if(typeof msg.users !== 'undefined'){
        userNameToElmMap.clear();
        userListElm.innerHTML = ""; //clear
        for(var i = 0; i < msg.users.length; i++){
            var userElm = document.createElement('li');
            userElm.innerText = msg.users[i];
            userListElm.appendChild(userElm);
        }
    }
}

window.onload = function (){
    var defaultName = "User " + Math.round(Math.random()*1000);

    name = prompt("Please enter your name", defaultName) || defaultName;

    lastUpdater = document.getElementById('last-updater');
    userListElm = document.getElementById('user-list');
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
            state: getVideoState(),
            name: name
        });
        ws.send(msg);
        setInterval(function(){
            ws.send(JSON.stringify({type: 'ping'}));
        }, 5000)
    }

    ws.onmessage = onMessage;
}