
export class FileGetter{

    protected static workers: Worker[] = []
    protected static MAX_WORKERS = 10;
    protected static WORKER_PATH = './FileWorker.ts';

    public static Parse(path: string) : ArrayBuffer | any {

        if (FileGetter.workers.length <= FileGetter.MAX_WORKERS){
            
            const w = new Worker(FileGetter.WORKER_PATH, {type: 'module'})
            w.postMessage(e)
            
            FileGetter.workers.
        }

        else {
            return new Error("Too Many Workers")
        }


    }



    // public async Parse(path: string) : Promise<any> {

    //     let audioData: AudioData | any;

    //     try {
            
    //         const bytes = await this._getBytes(path);
    //         const type = this._getType(bytes);
    //         switch (type){
    //             case 'wav':
    //                 audioData = this._getWav(bytes);
    //                 break;

    //             default:
    //                 audioData = new Error('Uknown Parsing Error')
    //         }

    //         return audioData;

    //     } catch (error: any){ 
    //         audioData = error; 
    //     }

    //     finally {
    //         return audioData
    //     }
    // }

    // protected async _getBytes(path: string) : Promise<any> {
        
    //     const response = await fetch(path);
    //     const bytes = response.arrayBuffer;
    //     console.log(bytes)
    //     return bytes
    // }

    // protected _getType (bytes: ArrayBuffer) : string{
    //     bytes = new ArrayBuffer(0);
    //     return 'wav'
    // }

    // //maybe improve this
    // protected _getWav (bytes: ArrayBuffer) : AudioData {
				
    //     //console.log(String.fromCharCode(...view.slice(0, 4)))

    //     const END_OF_FILE = 300; //this is fake
    //     const HEADER_LENGTH = 36;

    //     const view = new Uint8Array(bytes);
    //     const channels = view.slice(22, 24)[0];
    //     const sampleRate = new Int32Array(view.buffer.slice(24, 28))[0];
    //     const dtype = view.slice(34, HEADER_LENGTH)[0];
    
    //     const audioData = {
    //         channels: channels, 
    //         sampleRate: sampleRate, 
    //         dtype: dtype, 
    //         start: -1, 
    //         end: -1
    //     };

    //     let search = true;
    //     let idx = HEADER_LENGTH;
    //     let count = 0;
    
    //     while(search){

    //         let endIdx = idx + 4;
    //         const chunkType = String.fromCharCode(...view.slice(idx, endIdx))
    //         const chunkSize = new Int32Array(view.buffer.slice(endIdx, endIdx + 4))[0]
                        
    //         if (chunkType === 'data'){
    //             search = false
    //             audioData.start = endIdx + 4;
    //             audioData.end = audioData.start + chunkSize;
    //         }
    
    //         idx = endIdx + 4 + chunkSize
    //         count++;

    //         if (count > END_OF_FILE){
    //             console.error('No data chunk found!');
    //             search = false;
    //         }
    //     }
    
    //     return audioData
    
    // }



}