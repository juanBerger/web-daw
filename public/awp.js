
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

/** asssetMemory:
        {assetId: {
                    asset: {
                        dtype: number, //bit depth (16, 32)
                        channels: number //number channels - the data is default interleaved
                        start: number, //byte number, start of audio data
                        end: number, //byte number, end of audio data
                        data: ArrayBuffer //raw bytes, including header(s)/footer(s)
                        }
                    
                    //Planar arrays for each channel, converted to Float32
                    views: {
                        0: Float32Array
                        1: Float32Array
                    }
                }
        }
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
            this.assetMemory[am.assetId] = {
                asset: am,
                views: this._getAudioViews(am)
            };
            
        }

        else if (e.data.clipMemory){
            const cm = e.data.clipMemory;
            this.clipMemory[cm.clipId] = cm.data;
            console.log (this.clipMemory);
        }

        else if (e.data.transportMemory){
            this.transportMemory = e.data.transportMemory;
        }

        else if (e.data.tcMemory){
            Transport.tcMemory = e.data.tcMemory;
        }

    }
    
    _getClips(tl_Frame, processLength) {

        const clips = [];
        for (const key in this.clipMemory){

            const clip = this.clipMemory[key]; //this is a Clip object
            const left = Atomics.load(clip.left, 0);
            const mute = Atomics.load(clip.mute, 0);

            //is left between (tc @ idx = 0) and (tc @ idx = end of block
            //is muted false
            if (left <= (tl_Frame + processLength) && mute !== 1){ 
                
                clips.push({
                    assetId: Atomics.load(clip.assetId, 0),
                    left: left,
                    length: Atomics.load(clip.length, 0),
                    leftTrim: Atomics.load(clip.leftTrim, 0),
                    rightTrim: Atomics.load(clip.rightTrim, 0),
                    volume: Atomics.load(clip.volume, 0),
                })
            }
        }

        return clips
    }

    //Assumes ints for now,
    _getAudioViews (asset){

        let result = [];
        let srcElemView;
        let typeDiv;

        switch (asset.dtype){
            
            case 16:
                srcElemView = new Int16Array(asset.data, asset.start);
                typeDiv = 32767;
                break;
        }

        for (let ch = 0; ch < asset.channels; ch++){
            result.push(new Float32Array(srcElemView.length / asset.channels));
        }
        
        let j = 0;
        for (let i = 0; i < srcElemView.length; i += asset.channels){
            for (let ch = 0; ch < asset.channels; ch++){
                result[ch][j] = srcElemView[i + ch] / typeDiv;
            }
            j++
        }

        return result;
    }

    
    _getRMS (buffer){

        let sum = 0;
        for (let i = 0; i < buffer.length; i++){
            sum += buffer[i] * buffer[i];
        }

        const avg = sum / buffer.length;
        const rms = Math.sqrt(avg);
        return rms;

    }

    //called @3ms 1000 / (sr / processLength)
    process(inputList, outputList, parameters){

        if (Atomics.load(this.transportMemory, 0) == 1){

            Transport.toggle(1);

            const outputDevice = outputList[0];
            const processLength = outputDevice[0].length;

            //returns clip info for those that fall within this block

            const clips = this._getClips(Transport.tl_Frame, processLength);
            const tl_Idx = Transport.tl_Frame; //what is the timeline value of this frame in the process block

            for (const clip of clips){

                const asset = this.assetMemory[clip.assetId]; //get the actual audio data
                if (!asset)
                    continue
                
                const tl_clipEnd = clip.left + clip.length; //tl address for the end of this clip (hard coded length of cli)
                const tl_procEnd = tl_Idx + processLength; //tl address for the end of this block

                //Each block we increment our index into the source array. 
                //To do this we calculate the difference between the current tl address and the clip start address. 
                //A negative value means this clip starts in this block, so we start at zero (plus trim).
                const srcStart = Math.max(0, (tl_Idx - clip.left)) + clip.leftTrim; 
                
                //If the end of the tl address extends beyond this block, we fill up to the end of the block.
                //Otherwise calculate the remaining length of the clip and add to clipStart
                const srcEnd = tl_clipEnd > tl_procEnd ? srcStart + processLength : srcStart + (tl_clipEnd - tl_Idx);

                //We write to the beginning of this block if the clip started before this block
                const outStart = Math.max(0, (clip.left - tl_Idx)); 

                //We dont need this because the read and write lengths are the same
                //const outEnd = tl_clipEnd > tl_procEnd ? processLength : tl_procEnd - tl_clipEnd;
                
                
                for (let ch = 0; ch < asset.asset.channels; ch++){
                    const chView = asset.views[ch].subarray(srcStart, srcEnd);
                    for (let i = 0; i < chView.length; i++){
                        outputDevice[ch][outStart + i] += chView[i];
                    }
                }   

            }

            //console.log(this._getRMS(outputDevice[0]) + this._getRMS(outputDevice[1]));
            Transport.tick(processLength);
        }

        //toggle off if we have just been playing
        else if (Transport.isPlaying)
            Transport.toggle(0);

        return true

    }

}

registerProcessor('awp', AWP);



class Transport {

    static isPlaying = false;
    static sampleRate = 48000; 
    static tl_Frame = 0; //this needs like a setter that calls functions whenever this changes
    static tcMemory = null;
    static snapTo = 0;

    /**
     * @param {*} time 
     * @description snaps playhead to position as a result of UI change
     */
    static snap(time){
        Transport.tl_Frame = time;
         
        if (Transport.tcMemory) //need a setter to avoid all this
            Atomics.store(Transport.tcMemory, 0, Transport.tl_Frame);
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
     * @param {*} processLength 
     * @description ticks the clock by number of frames (frame = totalSamples / channels)
     */
    static tick(processLength) {
        Transport.tl_Frame += processLength;
        Atomics.store(Transport.tcMemory, 0, Transport.tl_Frame);
    }

}
