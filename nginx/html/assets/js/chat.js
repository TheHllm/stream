class Chat{
    constructor(_name, _chatInput, _chatWindow, _chatFrom){
        this.name = _name;
        this.chatInput = _chatInput;
        this.chatWindow = _chatWindow;
        this.chatFrom = _chatFrom;

        let t = this;
        this.chatFrom.addEventListener('submit', function (e){
            e.preventDefault();
            var msg = t.chatInput.value;
        
            if(msg){
                var data = JSON.stringify({
                    type: "chat",
                    text: msg
                });
                
                serverCon.ws.send(data);
                t.chatInput.value = "";
        
                t.chatWindow.appendChild(t._generateOutgoingChatMessage(msg));
                t.scrollChatDown();
            }
            return false;
        });


        this._beeper = new Beeper();
    }
    scrollChatDown(){
        this.chatWindow.scrollTop = this.chatWindow.scrollHeight;
    }
    onReciveMessage(name, text){
        this._beeper.beep(30);
        //scroll down
        this.chatWindow.scrollTop = this.chatWindow.scrollHeight;
        this.chatWindow.appendChild(this._generateIncomingChatMessage(name, text));
        this.scrollChatDown();
    }

    // Ui stuff
    _generateIncomingChatMessage(name, msg){
        var username = generateUsernameSpan(name);
        username.classList.add("small", "text-muted");
    
        var message = document.createElement("p");
        message.classList.add("text-break", "text-small", "mb-0");
        message.innerText = msg;
    
        //message body
        var body = document.createElement('div');
        body.classList.add("media-body", "mw-100", "ml-3", "bg-light", "rounded", "py-2", "px-3");
        body.appendChild(username);
        body.appendChild(message);
    
        var media = document.createElement("div");
        media.classList.add("align-self-start", "mw-90", "media", "mb-3");
        media.appendChild(body);
    
        return media;
    }
    
    _generateOutgoingChatMessage(msg){
    
        var username = generateUsernameSpan(this.name); //use own username
        username.classList.add("small", "text-white-muted");
        username.children[1].classList.remove("text-muted");
    
        var message = document.createElement("p");
        message.classList.add("text-break", "text-small", "text-white", "mb-0");
        message.innerText = msg;
    
        //message body
        var body = document.createElement('div');
        body.classList.add("media-body", "mw-100", "bg-primary", "rounded", "py-2", "px-3");
        body.appendChild(username);
        body.appendChild(message);
    
    
        var media = document.createElement("div");
        media.classList.add("align-self-end", "mw-90", "ml-5", "media", "mb-3", "bg-primary", "rounded");
        media.appendChild(body);
    
        return media;
    }
}

class Beeper{
    constructor(){
        this.atx = new AudioContext();
        this.o = this.atx.createOscillator();
        this.o.frequency.value = 2218;
        this.g = this.atx.createGain();
        this.g.gain.value = 0.1;
        this.o.connect(this.g);
        this.o.start(0);
    }
    beep(time){
        this.g.connect(this.atx.destination);
        let t = this;
        setTimeout(function (){t.g.disconnect(t.atx.destination);}, time);
    }
}