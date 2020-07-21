const ytIdRegex = /^.*(?:youtu.be\/|v\/|embed\/|watch\?|youtube.com\/user\/[^#]*#(?:[^\/]*?\/)*)\??v?=?([^#\&\?]*).*$/;
const ytRegex = /^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$/;



class Playlist{
    constructor(_playlist, _addForm, _addInput, _userlist){
        this.playlistElm = _playlist;
        this.addInput = _addInput;
        this.playlist = {index: -2, videos: []};
        this.video = null;
        this.defined = false;
        this.ignoreNextEndedTimer;
        this.ignoreNextEnded = false;
        this.userlist = _userlist;
        
        let _this = this;
        _addForm.addEventListener('submit', function(e){
            e.preventDefault(); //stop the submit

            if(_this.addInput.value) { //ony do something if we have a real value to send
                
                _this.playlist.videos.push({
                    type: _this.getVideoType(_this.addInput.value),
                    id:_this.addInput.value,
                    starttime: Date.now(),
                    time: 0,
                    playbackRate: 1,
                    paused: false });

                _this.addInput.value = "";
                $('#playlistAddModal').modal('hide');

                //re render
                _this._generatePlaylist();
                _this.userlist.blipSelf();
                _this.sendCurrentPlaylist();
            }

            return false; //stop the submit
        });

        Sortable.create(_playlist, {
			animation: 100,
            group: 'playlist',
            draggable: '.list-group-item',
            handle: '.list-group-item',
            sort: true,
			filter: 'button',
			preventOnFilter: false,
            onUpdate: function(event){
                swap(_this.playlist.videos, event.oldIndex, event.newIndex);

                if(_this.playlist.index == event.oldIndex){
                    _this.playlist.index = event.newIndex;
                }else if(_this.playlist.index == event.newIndex){
                    _this.playlist.index = event.oldIndex;
                }
                // Send playlist
                _this.sendCurrentPlaylist();
            }
        });
    }

    setVideoState(state, setVideoState = true){
        this.playlist.videos[this.playlist.index] = state;
        if(setVideoState) this.video.setVideoState(state);
    }

    getVideoType(id){
        var type = "file";
        if(id.match(ytRegex)){
            type = "yt";
        }
        return type;
    }

    sendCurrentPlaylist(){
        console.log(this.playlist);
        serverCon.ws.send(JSON.stringify({
            type: 'setplaylist',
            playlist: this.playlist
        }));
    }

    setPlaylist(data){
        this.defined = true;
        var matches = false;
        try{
            matches = data.index == this.playlist.index && data.videos[data.index].id == this.playlist.videos[this.playlist.index].id; // outofrange error might occur
        }catch(e){}

        if(!matches){
            this.ignoreNextEnded = true;
            clearTimeout(this.ignoreNextEndedTimer);
            let _this = this;
            this.ignoreNextEndedTimer = setTimeout(function(){_this.ignoreNextEnded = false;}, 1000);
            this.playlist = data;
            this.switchVideo();
        }else{
            this.playlist = data;
        }
        this._generatePlaylist();
    }

    swap(arr, from, to) {
        arr.splice(from, 1, arr.splice(to, 1, arr[from])[0]);
    }


    switchVideo(videoInfo){
        console.log("switching video");
        videoInfo = videoInfo || this.playlist.videos[this.playlist.index];
        if(this.video) this.video.disable();
        this.video = new Video(videoInfo.type, videoInfo.id);

        this.video.plyr.on("ended", this._nextVideo.bind(this));   
        if(videoInfo.time)
            this.video.setVideoState(videoInfo);
    }

    removeEntry(e){
        if(this.playlist.videos.length === 1){
            return; //last video -> dont delete.
        }
        var videoChanged = false;
        if(e.currentTarget.dataset.index == this.playlist.index){
            videoChanged = true;
        }
        this.playlist.videos.splice(e.currentTarget.dataset.index, 1);
        if(e.currentTarget.dataset.index <= this.playlist.index){
            this.playlist.index--;
        }
        if(this.playlist.index >= this.playlist.videos.length){
            this.playlist.index = this.playlist.videos.length - 1;
        }
        this._generatePlaylist();
        if(videoChanged){
            this.switchVideo();
            this.playlist.videos[this.playlist.index].paused = false;
            this.playlist.videos[this.playlist.index].time = 0;
            this.playlist.videos[this.playlist.index].starttime = getTime();
            this.video.setVideoState(this.playlist.videos[this.playlist.index]);
        }
        this.sendCurrentPlaylist();
    }

    playEntry(e){
        this.playlist.index = parseInt(e.currentTarget.dataset.index);
        
        this.playlist.videos[this.playlist.index].paused = false;
        this.playlist.videos[this.playlist.index].time = 0;
        this.playlist.videos[this.playlist.index].starttime = getTime();
        this._generatePlaylist();
        this.switchVideo();
        this.sendCurrentPlaylist();
    }

    _nextVideo(){
        if(this.ignoreNextEnded){
            return;
        }
        if(this.playlist.videos.length == 1){ // only one video in playlist
            return;
        }
        if(this.playlist.index == this.playlist.videos.length - 1){ // last video reached
            return;
        }
        this.playlist.index++;
        this._generatePlaylist();
        this.switchVideo();
        this.video.setVideoState(this.playlist.videos[this.playlist.index]);
        this.sendCurrentPlaylist();
    }

    _generatePlaylist(){
        let _this = this;
        this.playlistElm.innerHTML = "";
        for(var j=0; j < this.playlist.videos.length; j++){
            var displayName = this.playlist.videos[j].id;
            //container li
            var li = document.createElement('li');
            li.classList.add('list-group-item');
            if(j == this.playlist.index){
                li.classList.add('active'); //dont use active as it gets overwritten by the drag thingy
            }
            var i = document.createElement('i');
            i.classList.add('fa', 'fa-sort', 'mr-2')
            var display = document.createElement('span');
            display.innerText = displayName;
            //remove btn
            var rmBtn = document.createElement('button');
            rmBtn.classList.add('float-right', 'btn', 'btn-danger');
            rmBtn.dataset.index = j;
            rmBtn.onclick = this.removeEntry.bind(this);
            var faTrash = document.createElement('i');
            faTrash.classList.add('fa', 'fa-trash');
            rmBtn.appendChild(faTrash);

            //play button
            var playBtn = document.createElement('button');
            playBtn.classList.add('float-right', 'btn', "btn-success", "mx-1");
            playBtn.dataset.index = j;
            playBtn.onclick = this.playEntry.bind(this);
            var faPlay = document.createElement('i');
            faPlay.classList.add('fa', 'fa-play');
            playBtn.appendChild(faPlay);

            //append the components to the container
            li.append(i, display, rmBtn, playBtn);
            this.playlistElm.append(li);
        }
    }

    _generateVideoPlayer(video){
        if(video.type == "yt"){
            var id = video.id.match(ytIdRegex)[1];

            var iframe = document.createElement("iframe");
            iframe.src = "https://www.youtube.com/embed/" + id + "?iv_load_policy=3&playsinline=1&showinfo=0&rel=0&enablejsapi=1"
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
            source.setAttribute('src', "/uploads/" + video.id);
            videoTag.appendChild(source);
            return videoTag;
        }
    }
}