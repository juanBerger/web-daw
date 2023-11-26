
export class AudioGraph {

    audioContext?: AudioContext;
    awp?: AudioWorkletNode;

    public async initAudioContext(){
        
        this.audioContext = new AudioContext({latencyHint: "playback"}); 
        await this.audioContext.audioWorklet.addModule('./awp.js'); 
        this.awp = new AudioWorkletNode(this.audioContext, 'awp', {numberOfInputs: 1, numberOfOutputs: 2, outputChannelCount: [2, 2]});
        this._initTransportMemory();

    }

    public addClipNode(){


    }


    protected _initTransportMemory(){

        const sab = new SharedArrayBuffer(4);
        const view = new Uint32Array(sab);
        if (this.awp)
            this.awp.port.postMessage({transport_sab: view});

    }
    



}