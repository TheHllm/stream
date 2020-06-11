import WebSocket = require('ws');
import {Room} from './Room';

export class Server{
    public roomMap: Map<string, Room> = new Map<string, Room>();

    public run():void{

        var WebSocketServer = WebSocket.Server;
        var wss = new WebSocketServer({port: 5000});

        let server = this; //make 

        wss.on('connection', function(ws, req) {
            //wait for a join message
            let tws = ws; //make ws usable in on 'message'

            function fn(data:string){

                var msg = JSON.parse(data);
                if(msg.type != "join"){
                    ws.close();
                }else{
                    try{
                        //check if room exsits
                        tws.off('message', fn);
                        var roomId  = msg.room;
                        if(!server.roomMap.has(roomId)){ //TODO: change msg.video  to msg.room in client
                            server.roomMap.set(roomId, new Room(roomId, server));
                        }
                        server.roomMap.get(roomId)?.join(msg.name, tws);
                        
                    }catch{
                        console.log("closing");
                        ws.close();
                    }
                }
            }

            ws.on('message', fn)
        });
    }
}