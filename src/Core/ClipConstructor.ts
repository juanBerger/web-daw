import { AudioGraph } from "./AudioGraph";

export class ClipConstructor {

    clipId: number //random Int32
    assetId: number //random Int32
    left: number //frames
    top: number //pixels
    length: number //frames
    leftTrim?: number = 0 //frames
    rightTrim?: number = 0 //frames
    volume?: number = 1 //db
    mute?: number = 0
    data: SharedArrayBuffer = new SharedArrayBuffer(29)
    audioGraph: AudioGraph

    constructor(_audioGraph: AudioGraph, _clipId: number, _assetId: number, 
                _left: number, _top: number, _length: number,
                _leftTrim?: number, _rightTrim?: number,
                _volume?: number, _mute?: number){
        
        this.audioGraph = _audioGraph; //ref to the audioGraph instance
        this.clipId = _clipId;
        this.assetId = _assetId;
        this.left = _left; 
        this.top = _top; 
        this.length = _length;
        this.leftTrim = _leftTrim;
        this.rightTrim = _rightTrim;
        this.volume = _volume;
        this.mute = _mute

        console.log(this.length);

        this._syncSharedMemory();
        AudioGraph.awp?.port.postMessage({clipMemory: {clipId: this.clipId, data: new Uint8Array(this.data)}})
    }

    /**
     * 
     * @param cc : Tells us what values to write
     * @param view : View to memeory block to write to
     * @deecription :: Byte Structure is ::
     * 
     * | clipdId (4 bytes) | assetId (4 bytes) | left (4 bytes) | length (4 bytes) |
     * | leftTrim (4 bytes) | rightTrim (4 bytes) |
     * | vloume (4 bytes float32) | mute (1 byte uint8) |
     * 
     * ++ All 4 byte blocks are Int32 except where noted ++
     * 
     */

    //need to add length here?
    protected _syncSharedMemory () {

        const view = new Uint8Array(this.data);

        Atomics.store(view, 0, this.clipId); //
        Atomics.store(view, 4, this.assetId);
        Atomics.store(view, 8, this.left);
        Atomics.store(view, 12, this.length);

        this.leftTrim ? Atomics.store(view, 16, this.leftTrim) : Atomics.store(view, 16, 0);
        this.rightTrim ? Atomics.store(view, 20, this.rightTrim) : Atomics.store(view, 20, 0); 
        this.volume ? Atomics.store(view, 24, this.volume) : Atomics.store(view, 24, 1);
        this.mute ? Atomics.store(view, 28, this.mute) : Atomics.store(view, 28, 0);
    
    }


}