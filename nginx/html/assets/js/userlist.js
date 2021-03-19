
var nameInput;

function generateUsernameSpan(name, isSelf = false){
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

    if(isSelf){
        var cButton = document.createElement('button');
        cButton.type = 'button';
        cButton.classList.add('btn', 'btn-outline-secondary', 'float-right');
        cButton.innerHTML = '<i class="far fa-edit"></i>';
        cButton.onclick = function(){
            cButton.innerHTML = '<i class="far fa-check-square"></i>';
            div.removeChild(uspan);
            nameInput = document.createElement('input');
            nameInput.classList.add('nameEdit');
            nameInput.value = name.split('#')[0].trim();;

            nameInput.addEventListener("keyup", function(e) {
                event.preventDefault();
                if (e.key === 'Enter' || e.keyCode === 13) {
                    setName();
                }
            });

            div.prepend(nameInput);

            nameInput.focus();
            cButton.onclick = setName;
        };

        div.appendChild(cButton);
    }

    return div;
}

function setName(){
    let name = nameInput.value.trim() + " #" + Math.round(Math.random()*10000);
    window.localStorage.setItem('name', name);

    location.reload();
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
            userElm.appendChild(generateUsernameSpan(users[i], users[i] == this.username));
            
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