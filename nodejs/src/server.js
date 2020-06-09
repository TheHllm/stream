//global vars
var videos = {};
var sockets = new Map(); //maps each socket object to a video
var nameMap = new Map(); //maps each socket object to a name

function log(msg){
    if(false){
        console.log(msg);
    }
}

function onMessage(data){
    var message;
    try {
        message = JSON.parse(data);
    }catch(e){
        log("Maformed: " + data);
        return;
    }
    log(message);
    if(message.name){
        nameMap.set(this, message.name);
    }

    switch(message.type){
        case 'join':
            addSocketToVideo(message, this);
            break;
        case 'update':
            updateVideo(sockets.get(this), message.state, this);
        break;
        case 'ping':
            this.send(JSON.stringify({type: 'ping'}));
        break;
    }
}


function onClose(e){
    var ws = this;
    log("close");
    if(sockets.get(ws)){
        log("deleting ws");
        //remove assotioaion with video
        var video = videos[sockets.get(ws)];
        const index = video.clients.indexOf(ws);

        if (index > -1) {
            video.clients.splice(index, 1);
        }

        //delete entry in sockets
        sockets.delete(ws);
        nameMap.delete(ws);
    }
}


function sendUpdateToClients(video, wsOrig){
    //add the users ips:
    video.state.users = [];
    for(var i = 0; i < video.clients.length; i++){
        video.state.users.push(nameMap.get(video.clients[i]));
    }

    video.state.lastUpdater = nameMap.get(wsOrig);

    //turn into json
    var data = JSON.stringify(video.state);
    //send the data
    for(var i = 0; i < video.clients.length; i++){
        if(video.clients[i] !== wsOrig){
            video.clients[i].send(data);
            log("+" + i);
        }else{
            log("-" + i);
        }
    }
}

function addSocketToVideo(message, ws){
    var id = message.video;
    var state = message.state;

    //add socket to our list
    sockets.set(ws, id);

    //if video is new create new obj.
    if(!videos[id]){
        videos[id] = {
            clients: [],
            state:{
                starttime: state.starttime,
                time: state.time,
                playbackRate: state.playbackRate,
                paused: state.paused,
            }
        };
    }
    //push client into video
    videos[id].clients.push(ws);
    //propagate update
    sendUpdateToClients(videos[id], null);
}

function updateVideo(id, data, wsOrig){
    //check valid
    if( typeof data !== 'undefined' &&
        typeof data.starttime === 'number' &&
        typeof data.time == 'number' &&
        typeof data.playbackRate === 'number' &&
        typeof data.paused === 'boolean')
    {
        log(id);
        videos[id].state = data;
        sendUpdateToClients(videos[id], wsOrig);
    }else{
        log("invalid data @ update");
    }
}



//Start server
log("Server started on port 5000");
var WebSocketServer = require('ws').Server, wss = new WebSocketServer({port: 5000});

wss.on('connection', function(ws, req) {
    //save the ip in the ws obj

    nameMap.set(ws, req.headers['x-forwarded-for'] || req.connection.remoteAddress);

    ws.on('close', onClose);
    ws.on('error', onClose);
    ws.on('timeout', onClose); //TODO: fix timeout
    ws.on('message', onMessage);
 });
