
/**
 * BaseAudioContext is visible here so we can acces its properties (like sampleRate in the AWP constructor)
 * along with these: https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext
 */

/*
* CLIP SHARED MEMORY BLOCK
* 
* | clipdId (4 bytes) | assetId (4 bytes) | left (4 bytes) | length (4 bytes) |
* | leftTrim (4 bytes) | rightTrrim (4 bytes) |
* | vloume (4 bytes float32) | mute (1 byte uint8) |
* 
* ++ All 4 byte blocks are Int32 except where noted ++
* 
*/

class AWP extends AudioWorkletProcessor {

    assetMemory = {}; //this is not shared
    clipMemory = {} //this is shared
    transportMemory = null;

    constructor(){
        super();
        Transport.sampleRate = sampleRate;
        this.port.onmessage = this.onMessage.bind(this);
    }

    onMessage = (e) => {

        if (e.data.assetMemory){
            const am = e.data.assetMemory;
            this.assetMemory[am.assetId] = am;
            console.log(this.assetMemory);
            
        }

        else if (e.data.clipMemory){
            const cm = e.data.clipMemory;
            this.clipMemory[cm.clipId] = cm.data;
            console.log(cm);
        }

        else if (e.data.transportMemory){
            this.transportMemory = e.data.transportMemory;
        }

        else if (e.data.tcMemory){
            Transport.tcMemory = e.data.tcMemory;
        }

    }
    
    _getToRender(frame, blockSize) {

        const toRender = [];
        for (key of this.clipMemory){
            const clip = this.clipMemory[key];
            const left = Atomics.load(clip.data, 8);
            const mute = Atomics.load(clip.data, 28);

            //is left between (tc @ idx = 0) and (tc @ idx = end of block
            //is muted false
            if ((left >= frame && left < frame + blockSize) && mute !== 1){ 
                toRender.push({
                    assetId: Atomics.load(clip.data, 4),
                    left: left,
                    length: Atomics.load(clip.data, 12),
                    leftTrim: Atomics.load(clip.data, 16),
                    rightTrim: Atomics.load(clip.data, 20),
                    volume: Atomics.load(clip.data, 24),
                })
            }
        }

    }


    //called @3ms 1000 / (sr / blockSize)
    process(inputList, outputList, parameters){
        
        const outputDevice = outputList[0];
        const blocksize = outputDevice[0].length;
        
        if (this.transportMemory)
            Atomics.load(this.transportMemory, 0) == 1 ? Transport.toggle(1) : Transport.toggle(0);
        
        if (Transport.isPlaying){

            const renderObjs = this._getToRender(Transport.currentFrame, blocksize)
            
            for (let i = 0; i < blocksize; i++){

                //accumulate left and right here
                const p = Transport.currentFrame + i;
                for (let j = 0; j < renderObjs.length; j++){
                    
                    //check if it's time for this render object
                    const renderObj = renderObjs[j];
                    if (renderObj.left < p)
                        continue

                    const assetObj = this.assetMemory[renderObj.assetId];
                    



                    const sample_l = 
                    


                }

            }
            
            
            
            //scan through memory block


            


            Transport.tick();
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

    static toggle(state){

        if (state === 0){
            Transport.isPlaying = false;
            Transport.snap(Transport.snapTo);
        }
        
        else if (state === 1){
            Transport.isPlaying = true;
        }
    }


    /**
     * @param {*} blocksize 
     * @description ticks the clock by number of frames (frame = totalSamples / channels)
     */
    static tick(blocksize) {
        Transport.currentFrame += blocksize;
        Atomics.store(Transport.tcMemory, 0, Transport.currentFrame);
    }

}
