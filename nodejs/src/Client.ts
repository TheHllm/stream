import { Room } from './Room';
import { Video } from './Video';
import { Playlist} from './Playlist';
import WebSocket = require('ws');

export class Client {
    name: string
    private ws: WebSocket
    private room: Room

    public constructor(n: string, w: WebSocket, r: Room) {
        this.name = n;
        this.ws = w;
        this.room = r;

        let t = this;
        function onClose() {
            t.room.removeClient(t); //object is now dangeling -> will get gc-ed
        }

        //attach handles
        this.ws.on('close', onClose);
        this.ws.on('error', onClose);
        this.ws.on('timeout', onClose);

        this.ws.on('message', function (data: string) {
            var msg = JSON.parse(data);
            try {
                switch (msg.type) {
                    case 'setname':
                        t.name = msg.name;
                        t.room.sendNamesToAll();
                        break;
                    case 'setvideostate':
                        t.room.setVideoState(new Video(msg.state), t);
                        break;
                    case 'getvideostate':
                        t.room.sendVideoStateToClient(t);
                        break;
                    //chat
                    case 'chat':
                        t.room.sendChatToAll(msg.text, t);
                        break;
                    //playlist
                    case 'getplaylist':
                        t.room.sendPlaylist(t);
                        break;
                    case 'setplaylist':
                        t.room.setPlaylist(msg.playlist, t);
                        
                        break;

                    //utility
                    case 'ping':
                        t.send(JSON.stringify({ type: 'ping' }));
                        break;
                    default:
                        console.log("closing");
                        t.ws.close();
                        break;
                }
            } catch(q){console.log(q); t.ws.close(); }
        });
    }


    public send(msg: string) {
        this.ws.send(msg);
    }
}