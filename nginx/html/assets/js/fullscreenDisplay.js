class FullscreenDisplay {
    constructor(_bubbleElm, _bubbleText, _bubbleBlip, _chatForm, _chatText, _chat){
        this.bubbleElm = _bubbleElm;
        this.bubbleText = _bubbleText;
        this.bubbleBlip = _bubbleBlip;
        this.chatText = _chatText;
        this.chat = _chat;
        this.chatForm = _chatForm;

        this.chatCount = 0;

        _chatForm.addEventListener('submit', (function (e){
            e.preventDefault();
            var msg = this.chatText.value;
        
            this.chat.sendChat(msg);
            this.chatText.value = "";
            document.activeElement.blur();
            return false;
        }).bind(this));
    }

    blipUser(name, fullscreen){
        if(fullscreen === true){
            this.bubbleText.innerText = name;
            this.bubbleBlip.classList.remove("show");
            void this.bubbleBlip.offsetWidth; // Trigger a reflow to actually restart the animation
            this.bubbleBlip.classList.add("show");
        }
    }

    displayChat(name, text, fullscreen){
        if(fullscreen === true){
            var elm = this._generateChatMessage(name, text);
            this.bubbleElm.appendChild(elm);
            this.chatCount++;
            this.chatForm.classList.add("open");
            setTimeout((() => {
                this.bubbleElm.removeChild(elm);
                this.chatCount--;
                if(this.chatCount == 0)
                    this.chatForm.classList.remove("open");
            }).bind(this), 4250);
            /*
            this.bubbleName.innerText = name;
            this.bubbleText.innerText = text;
            this.bubbleElm.classList.remove("show");
            this.bubbleElm.classList.remove("chat");
            void this.bubbleElm.offsetWidth; // Trigger a reflow to actually restart the animation
            this.bubbleElm.classList.add("chat");*/
        }
    }

    _generateChatMessage(name, text){
        var username = generateUsernameSpan(name);
        username.classList.add("small", "text-muted");
    
        var message = document.createElement("p");
        message.classList.add("text-break", "text-small", "mb-0", "chat");
        message.innerText = text;
    
        //message body
        var body = document.createElement('div');
        body.classList.add("chat-card", "media-body", "bg-light", "rounded");
        body.appendChild(username);
        body.appendChild(message);
    
        return body;
    }
}