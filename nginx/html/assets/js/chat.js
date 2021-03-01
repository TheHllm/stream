class Chat{
    constructor(_name, _chatInput, _chatWindow, _chatFrom){
        this.name = _name;
        this.chatInput = _chatInput;
        this.chatWindow = _chatWindow;
        this.chatFrom = _chatFrom;

        this.chatFrom.addEventListener('submit', (function (e){
            e.preventDefault();
            var msg = this.chatInput.value;
        
            this.sendChat(msg);
            this.chatInput.value = "";
            return false;
        }).bind(this));


        this._beeper = new Beeper();
    }

    sendChat(msg){
        if(msg){
            var data = JSON.stringify({
                type: "chat",
                text: msg
            });
            
            var audio = new Audio('/assets/audio/notify1.m4r');
            audio.play();
            serverCon.ws.send(data);
    
            this.chatWindow.appendChild(this._generateOutgoingChatMessage(msg));
            this.scrollChatDown();
        }
    }

    scrollChatDown(){
        this.chatWindow.scrollTop = this.chatWindow.scrollHeight;
    }
    onReciveMessage(name, text){
        this._beeper.beep();
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
        media.classList.add("align-self-start", "mw-90", "media");
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
        media.classList.add("align-self-end", "mw-90", "ml-5", "media", "bg-primary", "rounded");
        media.appendChild(body);
    
        return media;
    }
}

class Beeper{
    beep(){
        var audio = new Audio('/assets/audio/notify.m4r');
        audio.play();
    }
}