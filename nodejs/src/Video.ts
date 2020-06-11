export class Video{
    type: string = "";
    id: string = "";
    starttime: number = Date.now();
    time: number = 0;
    playbackRate: number = 1;
    paused: boolean = false;

    public constructor(obj?:any){
        if(obj){
            this.type = obj.type;
            this.id = obj.id;
            this.starttime = obj.starttime;
            this.time = obj.time;
            this.playbackRate = obj.playbackRate;
            this.paused = obj.paused;
        }
    }

}