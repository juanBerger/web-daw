
import { AudioData } from '../Types';
import { AudioGraph } from './AudioGraph';
import { ClipConstructor } from './ClipConstructor';
import { RandomInt32, BytesToFrames, RandomUInt8 } from './Utils'

export class FileOpener{

    protected static WORKER_PATH = '../worker/OpenerWorker.ts';
    protected static BUILD_PATH_PREFIX = '../assets/';

    /**
     * @param paths : Array of file paths
     * @description : Parses files, passes audio data to awp
     */

    public static async Open(paths: string[]) : Promise<ClipConstructor[] | void> {
        await FileOpener._parse(paths);
    }


    /**
     * @param paths : Array of file paths
     * @description : Parses files, passes audio data to awp and generates clips from them with default values
     */
    public static async OpenAndGenerateClips(paths: string[]) : Promise<ClipConstructor[]> {
        let defaultTop = -20; //in pixels, a hack for now
        const ads = await FileOpener._parse(paths);
        return ads.map(ad => 
            new ClipConstructor(AudioGraph, RandomUInt8(), ad.assetId, 0, defaultTop+=80, BytesToFrames(ad)))
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
                        resolve(e.data.audioData); //data member will be detached
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