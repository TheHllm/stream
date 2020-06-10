
function generateUsernameSpan(name){
    //split into username and id
    var split = name.split('#');
    var id = "#" + split.pop();
    var username = split.join('');

    //crate the two parts
    var uspan = document.createElement('span');
    uspan.innerText = username;
    //uspan.classList.add('font-weight-bold');
    var ispan = document.createElement('span');
    ispan.innerText = id;
    ispan.classList.add('text-muted');
    ispan.classList.add('font-weight-light');
    ispan.classList.add('font-italic');
    
    //combine them
    var div = document.createElement('div');
    div.appendChild(uspan);
    div.appendChild(ispan);

    return div;
}

function generateIncomingChatMessage(name, msg){
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

function generateOutgoingChatMessage(msg){

    var username = generateUsernameSpan(name); //use own username
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


//userlist
var userListElm;
var userNameToElmMap = new Map();

function generateUserList(msg){
    if(typeof msg.users !== 'undefined'){
        userNameToElmMap.clear();
        userListElm.innerHTML = ""; //clear
        for(var i = 0; i < msg.users.length; i++){
            var userElm = document.createElement('li');
            userElm.classList.add("list-group-item");
            userElm.appendChild(generateUsernameSpan(msg.users[i]));
            
           if(msg.lastUpdater == msg.users[i])
                userElm.classList.add("blip");
                
            userListElm.appendChild(userElm);
            userNameToElmMap.set(msg.users[i], userElm);
        }
    }
}

function blipSelf(){
    var element = userNameToElmMap.get(name);

    element.classList.remove("blip");
    void element.offsetWidth; // Trigger a reflow to actually restart the animation
    element.classList.add("blip");
}