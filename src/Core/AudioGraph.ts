
export abstract class AudioGraph {


    static audioContext = new AudioContext({latencyHint: "playback"});
    static awp?: AudioWorkletNode;
    static AWP_PATH = './awp.js'

    static async init(){
        
        try {
            await AudioGraph.audioContext.audioWorklet.addModule(AudioGraph.AWP_PATH); 
            AudioGraph.awp = new AudioWorkletNode(AudioGraph.audioContext, 'awp', {numberOfInputs: 1, numberOfOutputs: 2, outputChannelCount: [2, 2]});
            AudioGraph.awp.connect(AudioGraph.audioContext.destination);

        } catch (error){ console.error(error)}
        

    }


}