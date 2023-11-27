
export class AudioGraph {

    audioContext: AudioContext;
    awp?: AudioWorkletNode;

    constructor(){
        this.audioContext = new AudioContext({latencyHint: "playback"}); 
    }

    /**
     * @param path local path to awp definition file. This method also connects the awp to the audio graph output
     */
    public async generateAWP(path: string) : Promise<void> {
        await this.audioContext.audioWorklet.addModule(path); 
        this.awp = new AudioWorkletNode(this.audioContext, 'awp', {numberOfInputs: 1, numberOfOutputs: 2, outputChannelCount: [2, 2]});
        this.awp.connect(this.audioContext.destination);
    }


}