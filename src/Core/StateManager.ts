
/**
 * This is what redux will be?
 * 
 * 
 */

export class StateManager {

    //static clipConstructors: ClipConstructor[] = [];
    //static renderClipArea: (ccs: ClipConstructor[]) => void;
    static zoomLevelCallbacks: (() => void)[] = [];

    static emitEvent(type: string) : void {

        switch (type){
            case 'zoomLevel':
                for (const fn of StateManager.zoomLevelCallbacks){
                    fn();
                }
                break;

        }


    }


}   