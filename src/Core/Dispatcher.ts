
import { AssetConstructor, ClipConstructor } from '../Types';
import { AudioGraph } from './AudioGraph';


export abstract class Dispatcher {
    
    static CLIP_MEMORY_SIZE = 25;
    static clipMemory?: any;
    static assetMemory = {};

    /**
     * 
     * @param cc : ClipConstructor 
     * @description creates a 25 byte sized shared memory block that holds clip meta data. This is separate from the underlying asset
     */
    public CreateClipMemory(cc: ClipConstructor) : void {        
        
        const buffer = new SharedArrayBuffer(Dispatcher.CLIP_MEMORY_SIZE);
        const view = new Uint8Array(buffer);
        
        
        this._updateClipMemory(cc, buffer);
        AudioGraph.awp?.port.postMessage({clipMemory: {assetId: cc.assetId, clipId: cc.clipId, data: view}})
        Dispatcher.clipMemory[cc.clipId] = {cc: cc, data: buffer};
    }

    /**
     * 
     * @param ac : AssetConstructor
     * @description creates a memory buffer that is transferred to awp. One asset id points to one variable sized block that is owned by AWP
     */
    public CreateAssetMemory(ac: AssetConstructor) : void {
        AudioGraph.awp?.port.postMessage({assetMemory: {assetId: ac.assetId, data: ac.data}}, [ac.data])
    }

    public UpdateClipMemory(cc: ClipConstructor){
        this._updateClipMemory(cc, Dispatcher.clipMemory[cc.clipId])
    }

    protected _updateClipMemory(cc: ClipConstructor, buffer: SharedArrayBuffer){

        const view = new Uint8Array(buffer);
        Atomics.store(view, 0, cc.assetId);
        Atomics.store(view, 4, cc.clipId);
        Atomics.store(view, 8, cc.start);
        //etc?
        //iterate through the keys of the

    }



    public static updateClipX(x: number) : void {
        
    }

};




