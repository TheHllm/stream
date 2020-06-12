

function getName(){
    //try to get name form disk
    var dname = window.localStorage.getItem('name');
    if(dname && !dname.startsWith("User #")){
        return dname;
    }else{
        var n = (prompt("Please enter your name", "User") || "User").trim() + " #" + Math.round(Math.random()*10000);
        if(!n.startsWith("User #")){
            window.localStorage.setItem('name', n);
        }
    }
    return n;
}


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

    playlist = new Playlist(document.getElementById('playlist'), document.getElementById('playlist-add-form'), document.getElementById('playlist-add-input'), userlist);

    //connection
    var roomId = this.findGetParameter('v');
    serverCon = new ServerConnection(name, roomId, chat, userlist, playlist); //TODO: injest video;
}

function getTime(){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "https://worldtimeapi.org/api/timezone/Etc/UTC", false ); // false for synchronous request
    xmlHttp.send( null );
    var time = JSON.parse(xmlHttp.responseText);
    return Date.parse(time.datetime);
}