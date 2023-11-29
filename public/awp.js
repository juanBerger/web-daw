
/**
 * BaseAudioContext is visible here so we can acces its properties (like sampleRate in the AWP constructor)
 * along with these: https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext
 */

class AWP extends AudioWorkletProcessor {

    assetMemory = {};
    clipMemory = {}
    transportMemory = null;

    constructor(){
        super();
        Transport.sampleRate = sampleRate;
        this.port.onmessage = this.onMessage.bind(this);
    }

    onMessage = (e) => {

        if (e.data.assetMemory){
            const am = e.data.assetMemory;
            this.assetMemory[am.assetId] = am.data
        }

        else if (e.data.clipMemory){
            const cm = e.data.clipMemory;
            this.clipMemory[cm.clipId] = cm.data;
        }

        else if (e.data.transportMemory){
            this.transportMemory = e.data.transportMemory;
        }

        else if (e.data.tcMemory){
            Transport.tcMemory = e.data.tcMemory;
        }

    }
    
    process(inputList, outputList, parameters){
    
        const outputDevice = outputList[0];
        const frames = outputDevice[0].length;
        Atomics.load(this.transportMemory) == 1 ? Transport.toggle(1, frames) : Transport.toggle(0);
        
        if (Transport.isPlaying){

            //get the audio and up it in the output buffers

            
        }

        return true

    }

}

registerProcessor('awp', AWP);


class Transport {

    static isPlaying = false;
    static sampleRate = 48000; 
    static currentFrame = 0; //this needs like a setter that calls functions whenever this changes
    static tcMemory = null;
    static snapTo = 0;

    /**
     * @param {*} time 
     * @description snaps playhead to position as a result of UI change
     */
    static snap(time){
        Transport.currentFrame = time;
         
        if (Transport.tcMemory) //need a setter to avoid all this
            Atomics.store(Transport.tcMemory, 0, Transport.currentFrame);
    }


    /**
     * @param {*} state : new transport state
     * @param {*} frames : passed on to tick(frames), which in turn increments the current frame number by `frames`
     */

    static toggle(state, frames = 0){

        if (state === 0){
            Transport.isPlaying = false;
            Transport.snap(Transport.snapTo);
        }
        
        else if (state === 1){
            Transport.isPlaying = true;
            Transport.tick(frames);
        }
    }


    /**
     * @param {*} frames 
     * @description ticks the clock by number of frames (frame = totalSamples / channels)
     */
    static tick(frames) {
        Transport.currentFrame += frames;
        Atomics.store(Transport.tcMemory, 0, Transport.currentFrame);
    }

}
