
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
            
            console.log(this.assetMemory);
            
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
    
    _getClips(tl_Frame, processLength) {

        const clips = [];
        for (const key in this.clipMemory){
            const clip = this.clipMemory[key]; //this is a Clip object
            const left = Atomics.load(clip, 8);
            const mute = Atomics.load(clip, 28);

            //is left between (tc @ idx = 0) and (tc @ idx = end of block
            //is muted false
            if (left <= (tl_Frame + processLength) && mute !== 1){ 
                
                clips.push({
                    assetId: Atomics.load(clip, 4),
                    left: left,
                    length: Atomics.load(clip, 12),
                    leftTrim: Atomics.load(clip, 16),
                    rightTrim: Atomics.load(clip, 20),
                    volume: Atomics.load(clip, 24),
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
                srcElemView = new Int16Array(asset.data, asset.start, asset.byteLength);
                typeDiv = 32767;
                break;
        }

        for (let ch = 0; ch < asset.channels; ch++){
            result.push(new Float32Array(srcElemView.length / asset.channels));
        }

        for (let i = 0; i < srcElemView.length; i += asset.channels){
            for (let ch = 0; ch < asset.channels; ch++){
                result[ch][i] = srcElemView[i + ch] / typeDiv;
            }

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


/**
 * t (timeline)
 * 3000     4000    5000
 * 
 * |        |       |
 *    
 *    |t 3200
 *    |c 200
 * 
 * 
 * 
 * 
 */



    //called @3ms 1000 / (sr / processLength)
    process(inputList, outputList, parameters){

        if (Atomics.load(this.transportMemory, 0) == 1){

            Transport.toggle(1);

            const outputDevice = outputList[0];
            const outputDevice_two = outputList[1];
            const processLength = outputDevice[0].length;

            //returns clip info for those that fall within this block

            const clips = this._getClips(Transport.tl_Frame, processLength);
            const tl_Idx = Transport.tl_Frame; //what is the timeline value of this frame in the process block

            for (const clip of clips){

                const asset = this.assetMemory[clip.assetId]; //get the actual audio data
                if (!asset)
                    continue
                
                const clipEnd = clip.left + clip.length;
                const tl_procEnd = tl_Idx + processLength;

                const srcStart = Math.max(0, (tl_Idx - clip.left + clip.leftTrim));
                //const srcEnd = 


                const outStart = Math.max(0, (clip.left - tl_Idx)); //if this num is positive, the clip starts somewhere in this block. Otherwise, we are continuing
                const outEnd = clipEnd > tl_procEnd ? processLength : tl_procEnd - clipEnd;
            
            
                for (let ch = 0; ch < asset.views.length; ch++){
                    for (let i = 0; i < outputDevice[ch].length; i++){
                        outputDevice[ch][i] = asset.views[ch][i];
                        outputDevice_two[ch][i] = asset.views[ch][i];
                    }
                }


                // for (const view of asset.views){
                //     //const subView = asset.views[ch].subarray(sliceStart, sliceEnd);
                //     for (let i = 0; i < subView.length; i++){
                //         outputDevice[ch][i] += subView[i]
                //     }
                // }
            
            }

            console.log(this._getRMS(output[0]))
            Transport.tick(output.length);
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


 
            

//i = render Idx
// for (let frame = 0; frame < processLength; frame++){

//     const tl_Idx = Transport.tl_Frame + frame; //what is the timeline value of this frame in the process block
//     const remain = processLength - frame;

    // for (const clip of clips){

    //     //frame = 100 -- we could only let === through
    //     if (clip.left > tl_Idx)
    //         continue

    //     const asset = this.assetMemory[clip.assetId]; //get the actual audio data
    //     if (!asset)
    //         continue

    //     const sliceStart = clip.leftTrim;
    //     let sliceEnd = clip.leftTrim + remain;
        
    //     //Disable until we fix length
    //     // if (sliceStart + length < sliceEnd)
    //     //     sliceEnd = sliceStart + length;

    //     for (const ch in asset.views){
    //         const subView = asset.views[ch].subArray(sliceStart, sliceEnd);
    //         for (let i = 0; i < sliceStart - sliceEnd; i++){
    //             outputDevice[ch][frame + i] += subView[i]
    //         }
    //     }
    
    // }

//}

// const output = outputList[0];
// output.forEach((channel) => {
// for (let i = 0; i < channel.length; i++) {
//     channel[i] = Math.random() * 2 - 1;
// }
// });