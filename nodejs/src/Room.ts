import {Client} from './Client';
import {Server} from './Server';
import {Playlist} from './Playlist';
import {Video} from './Video';
import WebSocket = require('ws');


export class Room{
    id: string
    clients: Array<Client> = new Array<Client>();
    private playlist: Playlist = new Playlist();

    private server: Server;
    
    public constructor(_id:string, s:Server){
        this.id = _id;
        this.server = s;
    }

    public join(name:string, ws: WebSocket){
        var c = new Client(name, ws, this);
        this.clients.push(c);
        //send the current state to the client

        this.sendNamesToAll();
    }
    
    public sendMessageToClients(msg:string, exclude?:Client){
        this.clients.forEach( cli => {
            if(cli != exclude){
                cli.send(msg);
            }
        });
    }

    public setVideoState(vid: any, exclude?:Client){
        this.playlist.setCurrentVideoState(new Video(vid));
        this.playlist.getCurrentVideo().lastUpdater = exclude?.name || "";

        this.clients.forEach( cli => {
            if(cli != exclude){
                this.sendVideoStateToClient(cli);
            }
        });
    }

    public sendVideoStateToClient(cli:Client){
        var msg = JSON.stringify({type: 'videostate', state: this.playlist.getCurrentVideo()});
        cli.send(msg);
    }

    public getNames() : Array<string>{
        return this.clients.map(function (cli){return cli.name});
    }

    public sendNamesToAll(){
        this.sendMessageToClients(JSON.stringify({type: 'userlist', users: this.getNames()}), undefined)
    }

    public sendChatToAll(msg:string, orig:Client){
        var data = JSON.stringify({type: 'chat', text: msg, name: orig.name});
        this.clients.forEach(cli => {
            if(cli != orig){
                cli.send(data);
            }
        });
    }
    
    public sendPlaylistToAll(){
        this.sendMessageToClients(JSON.stringify({type: 'playlist', playlist: this.playlist.getVideos()}));
    }

    public setPlaylist(obj:any, org:Client){
        //convert any into playlist
        this.playlist = new Playlist(obj); //convert into a proper object !important
        this.playlist.lastUpdater = org.name;
        this.sendPlaylistToAll();
    }

    public sendPlaylist(cli: Client){
        cli.send(JSON.stringify({type: 'playlist', playlist: this.playlist.getVideos()}));
    }

    public removeClient(cli:Client){
        this.clients = this.clients.filter(c => c != cli);
        if(this.clients.length === 0){
            this.server.roomMap.delete(this.id);
        }
    }
}