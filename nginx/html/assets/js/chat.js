var chatInput;
var chatWindow;

function sendChatMessage(e){
    e.preventDefault();
    var msg = chatInput.value;

    if(msg){
        var data = JSON.stringify({
            type: "chat",
            text: msg
        });
        
        ws.send(data);
        chatInput.value = "";

        var window = document.getElementById("chat-window");
        window.appendChild(generateOutgoingChatMessage(msg));
        scrollChatDown();
    }
    return false;
}

function reciveChatMessage(name, text){
    beep(30);
    //scroll down
    chatWindow.scrollTop = chatWindow.scrollHeight;
    chatWindow.appendChild(generateIncomingChatMessage(name, text));
    scrollChatDown();
}


var atx = new AudioContext();
var o = atx.createOscillator();
o.frequency.value = 2218;
var g = atx.createGain();
g.gain.value = 0.1;
o.connect(g);
o.start(0);


function beep(time){
    g.connect(atx.destination);
    setTimeout(function (){g.disconnect(atx.destination);}, time);
}

function scrollChatDown(){
    chatWindow.scrollTop = chatWindow.scrollHeight;
}