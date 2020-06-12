class ServerConnection{
    
    constructor(name, roomId, _chat, _userlist, _playlist){
        this.chat = _chat;
        this.name = name;
        this.roomId = roomId;
        this.initialized = false;
        this.userlist = _userlist;
        this.playlist = _playlist

        let _this = this;

        //actual conection
        this.ws = new WebSocket("wss://stream.hllm.tk/wss");
        this.ws.onopen = function (){
            var msg = JSON.stringify({
                type: "join",
                room: roomId,
                name: _this.name
            });
            _this.ws.send(msg); //join a room
            _this.ws.send(JSON.stringify({type: 'getvideostate'})); //ask for video state
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
                console.log(message);
                if(message.state.type != ""){
                    console.log("got a valid state");
                    if(!this.initialized){
                        this.playlist.switchVideo(message.state);
                    }
                    this.userlist.blipUser(message.state.lastUpdater);
                    this.playlist.video.setVideoState(message.state);
                }else{
                    this.playlist.switchVideo({type: this.playlist.getVideoType(findGetParameter('v')), id: findGetParameter('v')}); // Session isn't initialized
                    //send own state
                    this.sendVideoState(this.playlist.video.getVideoState());
                }
                if(!this.playlist.defined){
                    this.ws.send(JSON.stringify({type: 'getplaylist'}));
                }
                this.initialized = true;
            break;
            case 'playlist':
                this.playlist.setPlaylist(message.playlist);
                this.userlist.blipUser(message.playlist.lastUpdater);
            break;
            case 'userlist':
                this.userlist.generateUserList(message.users);
                break;
            case "chat":
                this.chat.onReciveMessage(message.name, message.text);
            break;
        }
    };

    sendVideoState(state){
        console.log("sending");
        var msg = JSON.stringify({
            type: 'setvideostate',
            state: state
        });
        this.ws.send(msg);
    }
}