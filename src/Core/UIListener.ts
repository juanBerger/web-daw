
/**
 * Listens for changes in a variety of shared blocks that need to eventually find their way to the UI. Like
 * _ Current TC address
 * _ Current level for various clips
 * _ Maybe others
 * 
 * - The idea is that the requestAnimationFrame is like the render loop 
 */
export class UIListener {

    protected static tcMemory: Int32Array //why doesn't this need an optional?
    protected static render = true;
    protected static lastTc = 0;

    static init(awp: AudioWorkletNode | undefined){

        const tcBuffer = new SharedArrayBuffer(4);
        UIListener.tcMemory = new Int32Array(tcBuffer);
        awp?.port.postMessage({tcMemory: UIListener.tcMemory})

        window.requestAnimationFrame(UIListener.Render)

    }

    //probably dont need the timestamp since we are driven by the audio clock
    static Render(timestamp: DOMHighResTimeStamp){

        const tc = Atomics.load(UIListener.tcMemory, 0);  
        
        if (tc !== UIListener.lastTc){

            //Render Clock Display
            //Render Playhead position

            UIListener.lastTc = tc;
            console.log(tc)
        }


        if (UIListener.render)
            window.requestAnimationFrame(UIListener.Render);
        

    }


}