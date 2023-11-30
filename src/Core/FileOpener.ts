
import { Dispatcher } from '../Core/Dispatcher';

export class FileOpener{

    protected static WORKER_PATH = '../worker/OpenerWorker.ts';
    protected static BUILD_PATH_PREFIX = '../assets/';

    /**
     * @param paths : Array of file paths
     * @param onFilesOpen : Callback function called as each file completes
     * @description Returns byte arrays representing audio data for each file. Work happens in worker thread.
     */

    public static Open(paths: string[]) : ArrayBuffer | any {

        const w = new Worker(new URL(FileOpener.WORKER_PATH, import.meta.url), {type: 'module'})
        const prefixed = paths.map(path => FileOpener.BUILD_PATH_PREFIX + path)
        w.postMessage({paths: prefixed})
        w.onmessage = e => {
            
            if (e.data.result === 'ok'){
                Dispatcher.CreateAssetMemory(e.data.data);
                
            }
                
            else if (e.data.result === 'error'){
                console.error(e.data.reason)
            }
        }
    }

}