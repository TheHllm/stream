var ws;
var name;

const defaultName = "User";

function onMessage(data){   
    var message = JSON.parse(data.data);

    switch(message.type){
        case "ping": //do nothing
            break;
        case "videostate":
            if(message.state.type != ""){
                console.log("got a valid state");
                setVideoState(message.state);
            }else{
                //send own state
                sendVideoState();
            }
        break;
        case 'userlist':
            generateUserList(message.users);
            break;
        case "chat":
            reciveChatMessage(message.name, message.text);
        break;
    }
}

function sendVideoState(){
    console.log("sending");
    var msg = JSON.stringify({
        type: 'setvideostate',
        state: getVideoState()
    });
    ws.send(msg);
}

function crateWebsocket(){
    //ask for a name
    name = getName();

    ws = new WebSocket("wss://stream.hllm.tk/wss");
    ws.onopen = function (){
        var msg = JSON.stringify({
            type: "join",
            room: videoId,
            name: name
        });
        ws.send(msg);
        ws.send(JSON.stringify({type: 'getvideostate'})); //ask for video state
        setInterval(function(){
            ws.send(JSON.stringify({type: 'ping'}));
        }, 5000)
    }

    ws.onmessage = onMessage;
}

function getName(){
    //try to get name form disk
    var dname = window.localStorage.getItem('name');
    if(dname && !dname.startsWith("User #")){
        return dname;
    }else{
        var n = (prompt("Please enter your name", defaultName) || defaultName).trim() + " #" + Math.round(Math.random()*10000);
        if(!n.startsWith("User #")){
            window.localStorage.setItem('name', n);
        }
    }
    return n;
}