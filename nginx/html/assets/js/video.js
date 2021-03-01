class Video{
    constructor(type, id){
        this.type = type;
        this.id = id;
        this.videoReady = false;
        this.lastState;
        this.disabled = false;

        var container = document.getElementById("video-container");
        container.innerHTML = "";

        container.appendChild(this._generateVideoPlayer());
        this.plyr = new Plyr('#video',{
            fullscreen: {container: "#outer-container"},
            invertTime: false, 
            speed: { selected: 1, options: [1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3,75, 4] },
            minimumSpeed: 1.5,
            maximumSpeed: 4,
          });



        if(!this.plyr.ready){
            this.plyr.on("ready", this._onVideoReady.bind(this));
        }else{
            setTimeout(this._onVideoReady.bind(this), 500); // The video probably isn´t *actually* ready, so lets just wait a bit until it is
        }

        var events = ["pause", "playing", "seeked", "ratechange"];
        for(var i = 0; i < events.length; i++){
            this.plyr.on(events[i], this.onStateChange.bind(this));
        }
    }

    disable(){
        if(this.disabled){
            return;
        }
        this.disabled = true;
        this.plyr.destroy();
    }

    onStateChange(e){
        if(this.disabled){
            return;
        }

        if(this.ignoreNextStateChange){
            clearTimeout(this.ignoreNextStateChangeResetTimeout);
            let _this = this;
            this.ignoreNextStateChangeResetTimeout = setTimeout(function (){_this.ignoreNextStateChange = false}, 500); // wait a bit before resetting this since one state change can trigger up to 4 events.
            console.log("resting ignore...");
        }else if(!this.videoReady){
            console.log("not ready");
            return;
        }else if(serverCon.ws.readyState === 1){
            console.log("onStateChanged... sending message");
            userlist.blipSelf();
            //send video state
            serverCon.sendVideoState(this.getVideoState());
        }
    }



    setVideoState(data){
        if(this.disabled){
            return;
        }
        this.lastState = data;
        if(!this.videoReady){
            console.trace("setting:", enrichState(data), "ignoring, not ready");
            return;
        }
        this.lastState.executed = true;
        console.trace("setting:", enrichState(data));

        clearTimeout(this.ignoreNextStateChangeResetTimeout);
        this.ignoreNextStateChange = true;
        console.log("setting state ignore:" + this.ignoreNextStateChange);
        this.plyr.speed = data.playbackRate;
        var time = data.time + ((getTime()) - data.starttime)/1000 * data.playbackRate * (data.paused ? 0 : 1);
        
        this.plyr.currentTime = time;
        if(data.paused){
            this.plyr.pause();
        }else{
            this.plyr.play();
        }
    }

    getVideoState(){
        if(this.disabled){
            return;
        }
        return {
            type: this.type,
            starttime: getTime(),
            time: this.plyr.currentTime || 0,
            playbackRate: this.plyr.speed || 1 ,
            paused: this.plyr.paused,
            id: this.id
        }
    }

    getIsFullscreen(){
        return this.plyr.fullscreen.active;
    }

    _onVideoReady(){
        if(this.disabled){
            return;
        }

        if(this.type == 'yt'){
            this.ignoreNextStateChange = true;
            clearTimeout(this.ignoreNextStateChangeResetTimeout);
            //make an interaction so we get sound
            this.plyr.elements.container.children[0].children[0].click();
            this.plyr.elements.container.children[0].children[0].click();
        }

        console.log("i am ready now");
        this.videoReady = true;
        if(this.lastState !== undefined && !(this.lastState.executed && this.lastState.executed === true)){
            this.setVideoState(this.lastState);
        }
    }



    _generateVideoPlayer(){
        if(this.type == "yt"){
            var ytId = this.id.match(ytIdRegex)[1];

            var iframe = document.createElement("iframe");
            iframe.src = "https://www.youtube.com/embed/" + ytId + "?iv_load_policy=3&playsinline=1&showinfo=0&rel=0&enablejsapi=1&autoplay=1"
            iframe.allow = "autoplay";
            iframe.allowFullscreen = true;

            var div = document.createElement("div");
            div.id = "video";
            div.classList.add("plyr__video-embed");
            div.appendChild(iframe);
            return div;
        }else{
            var videoTag = document.createElement("video");
            var source = document.createElement("source");
            videoTag.id = "video";
            videoTag.controls = true;
            videoTag.playsinline = true;
            
            try{
                new URL(this.id); //test if the id is really a 'link'
                source.setAttribute('src', this.id);
            }catch{
            source.setAttribute('src', "/uploads/" + this.id);
            }
            videoTag.appendChild(source);
            return videoTag;
        }
    }
    
}