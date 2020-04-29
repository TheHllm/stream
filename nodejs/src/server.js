//global vars
var videos = {};
var sockets = {};

function onMessage(data){
    var message;
    try {
        message = JSON.parse(data);
    }catch(e){
        console.log("Maformed: " + data);
        return;
    }
    console.log(message);
    switch(message.type){
        case 'join':
            addSocketToVideo(message, this);
            console.log("join " + message.video);
            break;
        case 'update':
            updateVideo(sockets[this], message.state);
            console.log("update " + message.state);
        break;
    }
}


function onClose(ws){
    console.log("close");
    if(sockets[ws]){
        //remove assotioaion with video
        var video = videos[sockets[ws]];
        const index = video.clients.indexOf(ws);

        if (index > -1) {
            video.clients.splice(index, 1);
        }

        //delete entry in sockets
        delete sockets[ws];
    }
}


function sendUpdateToClients(video){
    var data = JSON.stringify({
        starttime: video.starttime,
        time: video.time,
        playbackRate: video.playbackRate,
        paused: video.paused
    });
    for(var i = 0; i < video.clients.length; i++){
        video.clients[i].send(data);
        console.log(i);
    }
}

function addSocketToVideo(message, ws){
    var id = message.video;
    var state = message.state;

    sockets[ws] = id;

    if(!videos[id]){
        videos[id] = {
            clients: [],
            starttime: state.starttime,
            time: state.time,
            playbackRate: state.playbackRate,
            paused: state.paused
        };
    }
    videos[id].clients.push(ws);
    sendUpdateToClients(videos[id]);
}

function updateVideo(id, data){
    //check valid
    if( typeof data !== 'undefined' &&
        typeof data.starttime === 'number' &&
        typeof data.time == 'number' &&
        typeof data.playbackRate === 'number' &&
        typeof data.paused === 'boolean')
    {
        console.log(id);
        videos[id].starttime = data.starttime;
        videos[id].time = data.time;
        videos[id].playbackRate = data.playbackRate;
        videos[id].paused = data.paused;
        sendUpdateToClients(videos[id]);
    }
}



//Start server
console.log("Server started on port 5000");
var WebSocketServer = require('ws').Server, wss = new WebSocketServer({port: 5000});

wss.on('connection', function(ws) {
    ws.on('close', onClose);
    ws.on('error', onClose);
    ws.on('timeout', onClose); //TODO: fix timeout
    ws.on('message', onMessage);
 });
