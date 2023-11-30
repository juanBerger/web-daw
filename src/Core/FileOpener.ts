
import { Dispatcher } from '../Core/Dispatcher';

export class FileOpener{

    protected static WORKER_PATH = '../worker/OpenerWorker.ts';
    protected static BUILD_PATH_PREFIX = '../';

    /**
     * @param paths : Array of file paths
     * @param onFilesOpen : Callback function called as each file completes
     * @description Returns byte arrays representing audio data for each file. Work happens in worker thread.
     */

    public static Open(paths: string[]) : ArrayBuffer | any {

        const w = new Worker(new URL(FileOpener.WORKER_PATH, import.meta.url), {type: 'module'})
        w.postMessage({paths: paths})
        w.onmessage = e => {
            
            if (e.data.result === 'ok'){
                
                const bytes = e.data.data;
                Dispatcher.CreateAssetMemory({
                    assetId: 123, //this function should have assetIds for each path passed into it
                    data: bytes
                })
                
            }
                
            else if (e.data.result === 'error'){
                console.error(e.data.reason)
            }
        }
    }

}