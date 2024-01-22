
import { nanoid } from 'nanoid'

// interface AwpMsg {
//     id: string,
//     status: any
// }

type AwpMsgs = {
    [key: string]: any
}

export class AudioGraph {

    static audioContext = new AudioContext({latencyHint: "playback"});
    static awp?: AudioWorkletNode;
    static AWP_PATH = './awp.js'
    static isPlaying = false;
    static awpMsgs: AwpMsgs = {}; //{id: waiting/payload}

    static async init(){
        
        try {
            await AudioGraph.audioContext.audioWorklet.addModule(AudioGraph.AWP_PATH); 
            AudioGraph.awp = new AudioWorkletNode(AudioGraph.audioContext, 'awp', {numberOfInputs: 1, numberOfOutputs: 2, outputChannelCount: [2, 2]});
            AudioGraph.awp.connect(AudioGraph.audioContext.destination);
            AudioGraph.awp.port.onmessage = AudioGraph._onMessage;

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

    static async getWaveform(assetId: number, p_clipLength: number) : Promise<any> {

        
        return new Promise(async (resolve) => {
        
            const msgId = nanoid(5);
            AudioGraph.awpMsgs[msgId] = 'waiting';
            AudioGraph.awp?.port.postMessage({getWaveform: {assetId: assetId, msgId: msgId, p_clipLength: p_clipLength}});
            
            while(this.awpMsgs[msgId] === 'waiting'){
                await this._delay(10);
            }

            const payload = AudioGraph.awpMsgs[msgId];
            delete AudioGraph.awpMsgs[msgId];
            resolve(payload);
        })

    }

    static _onMessage(e: MessageEvent) {

        if (e.data.gotWaveform){
            const msgId = e.data.gotWaveform.msgId;
            if (msgId && (msgId in AudioGraph.awpMsgs)){
                AudioGraph.awpMsgs[msgId] = e.data.gotWaveform.payload;
            }
        }

    }

    static async _delay(ms: number){
        return new Promise(resolve => setTimeout(resolve, ms))
    }

}


