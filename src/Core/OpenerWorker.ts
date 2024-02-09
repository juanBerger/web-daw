
import { AudioData } from "../Types";
import { v5 as uuidv5 } from 'uuid'
import { RandomUInt8 } from "../Core/Utils";
import { Audio } from "three";

onmessage = async e => {

    if (e.data.path){
        
        try {
            const p = new Parser();
            const result = await p.Parse(e.data.path);
            postMessage({result: 'ok', audioData: result}, [result.data]);
        } catch (error){
            postMessage({result: 'error', reason: error});
        }
    }
}

class Parser {

    protected static UUID_NAMESPACE = 'd3346342-8b07-41f4-9091-a10774e7c50d';

    public async Parse(path: string) : Promise<any> {

        let audioData: AudioData | any;
        try {
            
            const bytes = await this._getBytes(path);
            const type = this._getType(); //stand in
            //const assetId = this._getAssetId(path);
            const assetId = RandomUInt8();

            switch (type){
                case 'wav':
                    audioData = this._getWav(bytes, assetId);
                    break;

                default:
                    audioData = new Error('Uknown Parsing Error')
            }

            //these both mutate the passed in AudioData object
            this._getViews(audioData);
            //await this._generateWaveform(audioData);

            return audioData;

        } catch (error: any){ 
            audioData = error;
            throw audioData;
        }
    }

    /**
     * 
     * @param audioData 
     * @note supports only 16 bit dtype at this time
     */
    protected async _generateWaveform(audioData: AudioData) : Promise<any> {

        // const stride = 400;
        // const buffer = audioData.data.slice(audioData.start, audioData.end);
        // const 


        // const waveForm = new Float32Array(left.length);
        
        // for (let i = 0, j = 0; i < left.length; i += stride, j++){
        //     waveForm[j] = left[i];
        // }

    }

    /**
     * 
     * @param audioData AudioData object
     * @abstract mutates instance of passed in object by attaching a list of Float32 Typed Arrays, one per channel
     * 
     */

    protected _getViews(audioData: AudioData) : void {

        let result = [];
        let srcElemView;
        let typeDiv;

        switch (audioData.dtype){
            
            case 16:
                srcElemView = new Int16Array(audioData.data, audioData.start);
                typeDiv = 32767;
                break;
        }

        if (srcElemView && typeDiv){

            for (let ch = 0; ch < audioData.channels; ch++){
                result.push(new Float32Array(srcElemView.length / audioData.channels));
            }
            
            //let j = 0;
            for (let i = 0, j = 0; i < srcElemView.length; i += audioData.channels, j++){
                for (let ch = 0; ch < audioData.channels; ch++){
                    result[ch][j] = srcElemView[i + ch] / typeDiv;
                }
                //j++
            }
        }

        audioData.views = result

    }

    //this gets replaced with a server call
    protected _getBytes(path: string) : Promise<ArrayBuffer> {
        
        return new Promise((resolve, reject) => {
            try {
                
                const req = new XMLHttpRequest();
                req.open("GET", path, true);
                req.responseType = "arraybuffer";
                req.send();
                req.onload = () => {
                    const bytes = req.response;
                    resolve(bytes);
                }
            } catch (error){
                console.log(error)
                reject(error)
            }
        })
    }

    protected _getType () : string{
        //bytes = new ArrayBuffer(0);
        return 'wav'
    }

    //Move this to utils
    protected _getAssetId(path: string){
        return uuidv5(path, Parser.UUID_NAMESPACE);
    }

    //maybe improve this
    protected _getWav (bytes: ArrayBuffer, assetId: number) : AudioData {
				
        //console.log(String.fromCharCode(...view.slice(0, 4)))
        const END_OF_FILE = 300; //this is fake
        const HEADER_LENGTH = 36;

        const view = new Uint8Array(bytes);
        const channels = view.slice(22, 24)[0];
        const sampleRate = new Int32Array(view.buffer.slice(24, 28))[0];
        const dtype = view.slice(34, HEADER_LENGTH)[0];

        const audioData = {
            
            assetId: assetId,
            channels: channels, 
            sampleRate: sampleRate, 
            dtype: dtype, 
            start: -1, 
            end: -1,
            data: bytes
        };

        let search = true;
        let idx = HEADER_LENGTH;
        let count = 0;
    
        while(search){

            let endIdx = idx + 4;
            const chunkType = String.fromCharCode(...view.slice(idx, endIdx))
            const chunkSize = new Int32Array(view.buffer.slice(endIdx, endIdx + 4))[0]
                        
            if (chunkType === 'data'){
                search = false
                audioData.start = endIdx + 4;
                audioData.end = audioData.start + chunkSize;
            }
    
            idx = endIdx + 4 + chunkSize
            count++;

            if (count > END_OF_FILE){
                console.error('No data chunk found!');
                search = false;
            }
        }
        
        return audioData
    
    }
}


         

    



        // const paths = e.data.paths;
        // const promises = paths.map((path: string) => {

        //     return new Promise(async (resolve, reject) => {            
        //         try {
        //             const p = new Parser();
        //             const result = await p.Parse(path);
        //             resolve(result);
        //         } catch (error){
        //             reject(error);
        //         }
        //     })

        // })

        // const results = await Promise.allSettled(promises);
        // results.forEach(result => {

        //     if (result.status === 'fulfilled'){
        //         postMessage({result: 'ok', data: result.value}, [result.value.data]);
        //     }
        //     else if (result.status === 'rejected') {
        //         postMessage({result: 'error', reason: result.reason});
        //     }
        // })