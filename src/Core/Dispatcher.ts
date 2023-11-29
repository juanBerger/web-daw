
import { AssetConstructor, ClipConstructor, ClipMemory } from '../Types';
import { AudioGraph } from './AudioGraph';

export class Dispatcher {
    
    static CLIP_MEMORY_SIZE = 25;
    static clipMemory: ClipMemory = {};
    static assetMemory = {};

    /**
     * @param cc : ClipConstructor 
     * @description : Creates a 25 byte sized shared memory block to hold clip meta data.
     */
    public static CreateClipMemory(cc: ClipConstructor) : void {        
        
        const buffer = new SharedArrayBuffer(Dispatcher.CLIP_MEMORY_SIZE);
        const view = new Uint8Array(buffer);
    
        Dispatcher._writeClipMemory(cc, view);
        AudioGraph.awp?.port.postMessage({clipMemory: {clipId: cc.clipId, data: view}})
        Dispatcher.clipMemory[cc.clipId] = view; 
    }

    /**
     * @param ac : AssetConstructor
     * @description : Transfers audio data to audio engine. This memory does not need to be shared
     */
    public static CreateAssetMemory(ac: AssetConstructor) : void {
        AudioGraph.awp?.port.postMessage({assetMemory: {assetId: ac.assetId, data: ac.data}}, [ac.data])
    }

    /**
     * @param cc : ClipConstructor
     * @description : Public wrapper function for _writeClipMemory()
     */
    public static UpdateClipMemory(cc: ClipConstructor){
        Dispatcher._writeClipMemory(cc, Dispatcher.clipMemory[cc.clipId])
    }




    /**
     * 
     * @param cc : Tells us what values to write
     * @param view : View to memeory block to write to
     * @deecription :: Byte Structure is ::
     * 
     * | clipdId (4 bytes) | assetId (4 bytes) | start (4 bytes) | leftTrim (4 bytes) | rightTrrim (4 bytes)
     * vloume (4 bytes (float32)) | mute (1 byte) |
     * 
     * ++ All 4 byte blocks are Int32 except where noted ++
     * 
     */

    protected static _writeClipMemory(cc: ClipConstructor, view: Uint8Array){

        //can't iterate through the object since the order of enumeration is not guranteed
        Atomics.store(view, 0, cc.clipId);
        Atomics.store(view, 4, cc.assetId);
        Atomics.store(view, 8, cc.start);
        Atomics.store(view, 12, cc.leftTrim);
        Atomics.store(view, 16, cc.rightTrim);
        Atomics.store(view, 20, cc.volume);
        Atomics.store(view, 24, cc.mute)
        
    }



    public static updateClipX(x: number) : void {
        
    }

};




