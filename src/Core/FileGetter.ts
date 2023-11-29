
export class FileGetter{

    protected static workers: Worker[] = []
    protected static MAX_WORKERS = 10;
    protected static WORKER_PATH = 'FileWorker.ts';

    public static Parse(path: string) : ArrayBuffer | any {

        if (FileGetter.workers.length <= FileGetter.MAX_WORKERS){
            
            const w = new Worker(FileGetter.WORKER_PATH, {type: 'module'})
            w.postMessage({path: path})
            w.onmessage = e => {
                
                if (e.data.result === 'ok')
                    console.log(e.data.bytes)
                
                else if (e.data.result === 'error'){
                    console.error(e.data.error)
                }
            }
            
            
        }

        else {
            return new Error("Too Many Workers")
        }


    }

}