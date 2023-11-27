
import { AssetConstructor, ClipConstructor } from '../Types';


export class Dispatcher {
    
    CLIP_MEMORY_SIZE = 25;
    awp?: AudioWorkletProcessor;

    constructor(awp: AudioWorkletProcessor | undefined){
        this.awp = awp;
    }

    /**
     * 
     * @param cc : ClipConstructor 
     * @description creates a 25 byte sized shared memory block that holds clip meta data. This is separate from the underlying asset
     */

    public CreateClipMemory(cc: ClipConstructor) : void {

        const buffer = new SharedArrayBuffer(this.CLIP_MEMORY_SIZE);
        const view = new Uint8Array(buffer);
    
    }

    /**
     * 
     * @param ac : AssetConstructor
     * @description creates a memory buffer that is transferred to awp. One asset id points to one variable sized block that is owned by AWP
     */
    public CreateAssetMemory(ac: AssetConstructor) : void {
        this.awp?.port.postMessage({assetMemory: {assetId: ac.assetId, data: ac.data}}, [ac.data])
    }


    public static updateClipX(x: number) : void {
        
    }

};




