import {Video} from './Video';
export class Playlist{
    private videos: Array<Video>
    private index: number
    
    lastUpdater: string = "";

    public constructor(srcObj?:any){
        if(srcObj){
            if(typeof srcObj.index === 'undefined'){throw "Wrong type for index, is " + typeof srcObj.index}

            this.index = Number(srcObj.index);
            this.videos = srcObj.videos.map((elm:any) => {return new Video(elm)}); 

        }else{
            this.videos = new Array<Video>();
            this.index = -1;
        }
    }
    
    public getCurrentVideo():Video{
        return this.videos[this.index];
    }

    public setCurrentVideoState(video: Video){
        this.videos[this.index] = video;
    }

    public switchIndex(ind:number){
        this.index = ind;
    }

    public getVideos():object{
        return {videos: this.videos, index: this.index, lastUpdater: this.lastUpdater};
    }
}