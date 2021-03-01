function getName(){
    //try to get name form disk
    var dname = window.localStorage.getItem('name');
    if(dname){
        return dname;
    }else{
        // Only request the names if it isn't saved
        var request = new XMLHttpRequest();
        request.open('GET', '/assets/js/first-names.json', false);  // `false` makes the request synchronous
        request.send(null);
        var prename = "User";
        if (request.status === 200) {
            let ar = JSON.parse(request.responseText);
            prename = ar[Math.floor(Math.random() * ar.length)];
        }

        var n = (prompt("Please enter your name", prename) || prename).trim() + " #" + Math.round(Math.random()*10000);
        if(!n.startsWith("User #")){
            window.localStorage.setItem('name', n);
        }
    }
    return n;
}

function unfocus(evt) {
    evt = evt || window.event;
    if (evt.keyCode == 27) {//27 is the code for escape
        evt.currentTarget.blur(); 
    }
};

function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
          tname = item.substr(0,item.indexOf('='));
          if (tname === parameterName) result = decodeURIComponent(item.substr(item.indexOf('=')+1));
        });
    return result;
}


var chat;
var userlist;
var playlist;
var serverCon;

window.onload = function (){
    //get the users name
    var name = this.getName();

    //userlist
    userlist = new Userlist(name, document.getElementById('user-list'));

    //chat
    chat = new Chat(name, document.getElementById('chat-input'), document.getElementById("chat-window"), document.getElementById('chat-form'));

    fullscreen = new FullscreenDisplay(document.getElementById('fullscreenBubble'), document.getElementById('fullscreenText'), document.getElementById("fullscreenBlip"),
                                        document.getElementById("chat-form-fullscreen"), document.getElementById("chat-input-fullscreen"), chat);

    playlist = new Playlist(document.getElementById('playlist'), document.getElementById('playlist-add-form'), document.getElementById('playlist-add-input'), userlist);

    //connection
    var roomId = this.findGetParameter('v');
    serverCon = new ServerConnection(name, roomId, chat, userlist, playlist, fullscreen); //TODO: ingest video;
}

let offset;
function getTime(){
    if(typeof offset === 'undefined'){
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", "time", false ); // false for synchronous request
        xmlHttp.send( null );
        offset = xmlHttp.responseText - Date.now();
    }
    return Date.now() + offset;
}

function enrichState(state){
    var data = Object.assign({}, state);
    data.realTime = data.time + ((getTime()) - data.starttime)/1000 * data.playbackRate * (data.paused ? 0 : 1);
    return data;
}