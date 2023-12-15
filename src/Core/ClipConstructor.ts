import { AudioGraph } from "./AudioGraph";

export class ClipConstructor {

    clipId: number //
    assetId: number
    left: number
    top: number
    leftTrim?: number = 0;
    rightTrim?: number = 0;
    volume?: number = 1;
    mute?: number = 0;
    data: SharedArrayBuffer = new SharedArrayBuffer(25)
    audioGraph: AudioGraph

    constructor(_audioGraph: AudioGraph, _clipId: number, _assetId: number, 
                _left: number, _top: number, 
                _leftTrim?: number, _rightTrim?: number,
                _volume?: number, _mute?: number){
        
        this.audioGraph = _audioGraph; //ref to the audioGraph instance
        this.clipId = _clipId;
        this.assetId = _assetId;
        this.left = _left;
        this.top = _top;
        this.leftTrim = _leftTrim;
        this.rightTrim = _rightTrim;
        this.volume = _volume;
        this.mute = _mute

        this._syncSharedMemory();
        AudioGraph.awp?.port.postMessage({clipMemory: {clipId: this.clipId, data: new Uint8Array(this.data)}})
    }



    /**
     * 
     * @param cc : Tells us what values to write
     * @param view : View to memeory block to write to
     * @deecription :: Byte Structure is ::
     * 
     * | clipdId (4 bytes) | assetId (4 bytes) | start (4 bytes) | leftTrim (4 bytes) | rightTrrim (4 bytes)
     * vloume (4 bytes (float32)) | mute (1 byte) |  
     * ++ All 4 byte blocks are Int32 except where noted ++
     * 
     */

    protected _syncSharedMemory () {

        const view = new Uint8Array(this.data);
        //const te = new TextEncoder(); //use this to get  a byte array ?
        
        Atomics.store(view, 0, this.clipId); //
        Atomics.store(view, 4, this.assetId);
        Atomics.store(view, 8, this.left);
        
        this.leftTrim ? Atomics.store(view, 12, this.leftTrim) : Atomics.store(view, 12, -1);
        this.rightTrim ? Atomics.store(view, 16, this.rightTrim) : Atomics.store(view, 16, -1); 
        this.volume ? Atomics.store(view, 20, this.volume) : Atomics.store(view, 20, 1);
        this.mute ? Atomics.store(view, 24, this.mute) : Atomics.store(view, 24, 0);
    
        
    }


}