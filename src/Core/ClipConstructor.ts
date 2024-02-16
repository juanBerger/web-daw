import { AudioGraph } from "./AudioGraph";
import { ZoomHandler } from "./ZoomHandler";

export class ClipConstructor {

    audioGraph: AudioGraph
    clipId: number //random Int32
    assetId: number //random Int32
    left: number //pixels
    top: number //pixels
    length: number //frames
    domRef: any //html element ref

    waveform: ArrayBuffer = new ArrayBuffer(1)
    data: SharedArrayBuffer = new SharedArrayBuffer(29)

    leftTrim?: number = 0 //frames
    rightTrim?: number = 0 //frames
    volume?: number = 1 //db
    mute?: number = 0
    
    sharedViews: any = {

        clipId: new Int32Array(this.data.slice(0, 4)),
        assetId: new Int32Array(this.data.slice(4, 8)),
        left: new Int32Array(this.data.slice(8, 12)),
        length: new Int32Array(this.data.slice(12, 16)),
        leftTrim: new Int32Array(this.data.slice(16, 20)),
        rightTrim: new Int32Array(this.data.slice(20, 24)),
        volume: new Int32Array(this.data.slice(24, 28)),
        mute: new Uint8Array(this.data.slice(28, 29))
    }
    

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

        this._syncSharedMemory();
        AudioGraph.awp?.port.postMessage({clipMemory: {clipId: this.clipId, data: this.sharedViews}})
      
    }

    /**
     * 
     * @param cc : Tells us what values to write
     * @param view : View to memory block to write to
     * @deecription :: Byte Structure is ::
     * 
     * | clipdId (4 bytes) | assetId (4 bytes) | left (4 bytes) | length (4 bytes) |
     * | leftTrim (4 bytes) | rightTrim (4 bytes) |
     * | vloume (4 bytes float32) | mute (1 byte uint8) |
     * 
     * ++ All 4 byte blocks are Int32 except where noted ++
     * 
     */

    protected _syncSharedMemory () {

        Atomics.store(this.sharedViews.clipId, 0, this.clipId); //
        Atomics.store(this.sharedViews.assetId, 0, this.assetId);
        Atomics.store(this.sharedViews.left, 0, this.left);
        Atomics.store(this.sharedViews.length, 0, this.length);

        this.leftTrim ? Atomics.store(this.sharedViews.leftTrim, 0, this.leftTrim) : Atomics.store(this.sharedViews.leftTrim, 0, 0);
        this.rightTrim ? Atomics.store(this.sharedViews.rightTrim, 0, this.rightTrim) : Atomics.store(this.sharedViews.rightTrim, 0, 0); 
        this.volume ? Atomics.store(this.sharedViews.volume, 0, this.volume) : Atomics.store(this.sharedViews.volume, 0, 1);
        this.mute ? Atomics.store(this.sharedViews.mute, 0, this.mute) : Atomics.store(this.sharedViews.mute, 0, 0);

    }

    setDomRef(domRef: any){
        this.domRef = domRef;
    }

    /**
     * @abstract updates the shared memory block that holds the position of this clip
     * @param l num pixels from left boundry
     * @param t num pixels from top boundry (unused, audio does not need to know about top)
     */

    syncPosition (l: number, t: number) {
        this.left = l;
        this.top = t;
        Atomics.store(this.sharedViews.left, 0, ZoomHandler.PixelsToFrames(this.left));
    }

    async getWaveform() : Promise<any> {
        this.waveform = await AudioGraph.getWaveform(this.assetId, ZoomHandler.FramesToPixels(this.length));
        return this.waveform;
    }


}

