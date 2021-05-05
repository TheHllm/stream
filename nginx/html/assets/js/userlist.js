
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

class Userlist{
    constructor(name, _userListElm){
        this.userListElm = _userListElm;
        this.username = name;
        this.userNameToElmMap = new Map();
    }

    generateUserList(users){
        this.userNameToElmMap.clear();
        this.userListElm.innerHTML = ""; //clear
        for(var i = 0; i < users.length; i++){
            var userElm = document.createElement('li');
            userElm.classList.add("list-group-item");
            userElm.appendChild(generateUsernameSpan(users[i]));
            
            this.userListElm.appendChild(userElm);
            this.userNameToElmMap.set(users[i], userElm);
        }
    }

    blipUser(name){
        var element = this.userNameToElmMap.get(name);
        if(!element)
            return;

        element.classList.remove("blip");
        void element.offsetWidth; // Trigger a reflow to actually restart the animation
        element.classList.add("blip");

    }

    blipSelf(){
        this.blipUser(this.username);
    }
}