
import { AudioData } from '../Types';
import { AudioGraph } from './AudioGraph';
import { ClipConstructor } from './ClipConstructor';

export class FileOpener{

    protected static WORKER_PATH = '../worker/OpenerWorker.ts';
    protected static BUILD_PATH_PREFIX = '../assets/';

    /**
     * @param paths : Array of file paths
     * @param createClips : If true, creates new clips based on new assets with default values
     * @description : Parses files and passes memory to awp
     */

    public static async Open(paths: string[], createClips = false) : Promise<ClipConstructor[]> {
        
        const ads = await FileOpener._parse(paths);
        if (createClips){
            return ads.map(ad => 
                new ClipConstructor(AudioGraph, ad.assetId, ad.assetId, 0, 0))
        }
    }
    
    /**
     * 
     * @param paths : An array of file paths,
     * @returns : An array of promises which resolve to an AudioData instance
     */
    protected static async _parse(paths: string[]) : Promise<AudioData[]> {
        
        const prefixed = paths.map(path => FileOpener.BUILD_PATH_PREFIX + path)
        const promises = prefixed.map(path => {
            
            return new Promise((resolve, reject) => {
                
                const w = new Worker(new URL(FileOpener.WORKER_PATH, import.meta.url), {type: 'module'})
                w.postMessage({path: path})
                w.onmessage = e => {
            
                    if (e.data.result === 'ok'){
                        AudioGraph.awp?.port.postMessage({assetMemory: e.data.audioData}, [e.data.audioData.data])
                        e.data.data = 'detached';
                        resolve(e.data); //data member will be detached
                    }
                    
                    else if (e.data.result === 'error'){
                        console.error(e.data.reason)
                        reject(e.data.reason);
                    }

                    w.terminate();
                }
            })
        })

        const results = await Promise.allSettled(promises);
        return results
            .filter((result: any): result is PromiseFulfilledResult<AudioData> => result.status === 'fulfilled')
            .map(result => result.value);
    }

    


}

//Maybe a few ways of opening memory
/**
 *  - Paths (array) -> Leads to assets
 *  - 
 *  - Clips (array of objects) --> leads to (or are) ClipConstructors which lead to clips
 *  -
 * 
 * The above are spearate however there has to be any easy way to <make> clips depend on paths -- this would be the case with drag and drop
 * 
 * 
 * 
 * 
 *  
 */

