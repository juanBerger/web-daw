
export class AudioGraph {

    static audioContext = new AudioContext({latencyHint: "playback"});
    static awp?: AudioWorkletNode;
    static AWP_PATH = './awp.js'
    static isPlaying = false;

    static async init(){
        
        
        try {
            await AudioGraph.audioContext.audioWorklet.addModule(AudioGraph.AWP_PATH); 
            AudioGraph.awp = new AudioWorkletNode(AudioGraph.audioContext, 'awp', {numberOfInputs: 1, numberOfOutputs: 2, outputChannelCount: [2, 2]});
            AudioGraph.awp.connect(AudioGraph.audioContext.destination);

            
            const buffer = new SharedArrayBuffer(1);
            const view = new Uint8Array(buffer);
            AudioGraph.awp?.port.postMessage({transportMemory: view})

            /**
             * @description : notifies awp of tranport state change
             */
            window.onkeydown = e => {
                if (e.key === ' '){
                    AudioGraph.isPlaying = !AudioGraph.isPlaying;
                    Atomics.store(view, 0, Number(AudioGraph.isPlaying));
                }
            }



        } catch (error){ console.error(error)}
    
    }

}