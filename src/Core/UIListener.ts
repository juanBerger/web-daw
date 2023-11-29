
/**
 * Listens for changes in a variety of shared blocks that need to eventually find their way to the UI. Like
 * _ Current TC address
 * _ Current level for various clips
 * _ Maybe others
 * 
 * - The idea is that the requestAnimationFrame is like the render loop 
 */
export class UIListener {

    static init(awp: AudioWorkletNode | undefined){

        const tcBuffer = new SharedArrayBuffer(4);
        const tcView = new Uint8Array(tcBuffer);
        awp?.port.postMessage({tcMemory: tcView})

    }    






}