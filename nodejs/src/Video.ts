export class Video{
    type: string = "";
    id: string = "";
    starttime: number = Date.now();
    time: number = 0;
    playbackRate: number = 1;
    paused: boolean = false;

    lastUpdater: string = "";

    public constructor(obj?:any){
        if(obj){
            //check that all the values are in order
            if(typeof obj.type !== "string") {throw "Wrong value in video for type";}
            if(typeof obj.id !== "string") {throw "Wrong value in video for id";}
            if(typeof obj.starttime !== "number") {throw "Wrong value in video for starttime was: " + typeof obj.starttime;}
            if(typeof obj.time !== "number") {throw "Wrong value in video for time";}
            if(typeof obj.playbackRate !== "number") {throw "Wrong value in video for playbackrate";}
            if(typeof obj.paused !== "boolean") {throw "Wrong value in video for paused";}

            this.type = obj.type;
            this.id = obj.id;
            this.starttime = obj.starttime;
            this.time = obj.time;
            this.playbackRate = obj.playbackRate;
            this.paused = obj.paused;
        }
    }

}