
export class StateManager {

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