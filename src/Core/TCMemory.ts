
export class TCMemory {

    protected static tcMemory: Int32Array //why doesn't this need an optional?
    protected static render = true;
    static tc = 0;

    static init(awp: AudioWorkletNode | undefined){

        const tcBuffer = new SharedArrayBuffer(4);
        TCMemory.tcMemory = new Int32Array(tcBuffer);
        awp?.port.postMessage({tcMemory: TCMemory.tcMemory})
        //window.requestAnimationFrame(UIListener.Render) //using r3f render loop

    }

    static sync() : void {

        const newTc = Atomics.load(TCMemory.tcMemory, 0);
        if (newTc !== TCMemory.tc)
            TCMemory.tc = newTc; //this has to be a copy op
        
    }

}


//probably dont need the timestamp since we are driven by the audio clock
// static Render(timestamp: DOMHighResTimeStamp){

//     const tc = Atomics.load(UIListener.tcMemory, 0);          
//     if (tc !== UIListener.lastTc){

//         //Render Clock Display
//         //Render Playhead position

//         UIListener.lastTc = tc;
//         //console.log(tc)
//     }


//     if (UIListener.render)
//         window.requestAnimationFrame(UIListener.Render);
    
// }