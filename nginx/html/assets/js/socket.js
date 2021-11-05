class ServerConnection{
    
    constructor(name, roomId, _chat, _userlist, _playlist, _fullscreen){
        this.chat = _chat;
        this.name = name;
        this.roomId = roomId;
        this.initialized = false;
        this.userlist = _userlist;
        this.playlist = _playlist
        this.fullscreen = _fullscreen;

        let _this = this;

        //actual conection
        this.ws = new WebSocket(window.location.origin.replace('http', 'ws') + "/wss");
        this.ws.onopen = function (){
            var msg = JSON.stringify({
                type: "join",
                room: roomId,
                name: _this.name
            });
            _this.ws.send(msg); //join a room
            _this.ws.send(JSON.stringify({type: 'getplaylist'}));//ask for playlist
            //load the playlist only once we have the current video, so that it will contain good data, even if the room is new
            setInterval(function(){
                _this.ws.send(JSON.stringify({type: 'ping'}));
            }, 5000)
        }
    
        
        this.ws.onmessage = this.onmessage.bind(this);
    }

    onmessage(data){
        var message = JSON.parse(data.data); //decode data into a message
        switch(message.type){ //actions depending on type of message
            case "ping": //do nothing
                break;
            case "videostate":
                if(message.state.type != ""){
                    if(!this.initialized){
                        this.playlist.switchVideo(message.state);
                    }else{
                        this.playlist.setVideoState(message.state);
                    }
                    this.userlist.blipUser(message.state.lastUpdater);
                    this.fullscreen.blipUser(message.state.lastUpdater, this.playlist.getIsFullscreen());
                }else{
                    this.playlist.switchVideo({type: this.playlist.getVideoType(getRoomId()), id: getRoomId()}); 
                    //send own state
                    this.sendVideoState(this.playlist.video.getVideoState());
                }
                this.initialized = true;
            break;
            case 'playlist':
                if(message.playlist.index == -1 || (message.playlist.videos && message.playlist.videos.length == 0)){// Session isn't initialized
                    message.playlist.videos.push({type: this.playlist.getVideoType(getRoomId()), id: getRoomId()});
                    message.playlist.index = 0;
                    this.playlist.setPlaylist(message.playlist);
                    this.playlist.setVideoState(this.playlist.video.getVideoState(), false);
                    this.playlist.sendCurrentPlaylist();
                }else{
                    this.playlist.setPlaylist(message.playlist);
                    this.userlist.blipUser(message.playlist.lastUpdater);
                    this.fullscreen.blipUser(message.playlist.lastUpdater, this.playlist.getIsFullscreen());
                }
            break;
            case 'userlist':
                this.userlist.generateUserList(message.users);
                break;
            case "chat":
                this.chat.onReciveMessage(message.name, message.text);
                this.fullscreen.displayChat(message.name, message.text, this.playlist.getIsFullscreen());
            break;
        }
    };

    sendVideoState(state){
        var obj = {
            type: 'setvideostate',
            state: state
        };
        console.trace("sending:", enrichState(obj.state));
        var msg = JSON.stringify(obj);
        this.ws.send(msg);
        this.playlist.setVideoState(state, false); // update state in playlist
    }
}
