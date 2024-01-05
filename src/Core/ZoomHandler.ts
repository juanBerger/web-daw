import { StateManager } from "./StateManager";

export class ZoomHandler {

    static level = 3;
    protected static level_MULT = 512;

    static getFPP() : number {
        return ZoomHandler.level * ZoomHandler.level_MULT;
    }


    /**
     * 
     * @param frames Number of audio frames to represent as pixels.
     * @param fullLength We draw our number of frames to fit in the current viewport. This replaces the current zoom level.
     * @returns number of pixels needed to draw given number of frames.
     */

    static FramesToPixels(frames: number, fullLength = false) : number{
        
        const fpp = !fullLength ? ZoomHandler.level * ZoomHandler.level_MULT : (() => {
            
            const viewport = document.getElementById('ca-parent');
            if (viewport)
                return frames / viewport.clientWidth;
            else
                return 0
        })();

        return frames / fpp;

    }

    static PixelsToFrames(pixels: number) : number {
        return pixels * ZoomHandler.level * ZoomHandler.level_MULT;
    }

    //Need to trigger a redraw
    static up(){

        Math.floor(ZoomHandler.level++);
        if (ZoomHandler.level >= 10)
            ZoomHandler.level = 10;

        StateManager.emitEvent('zoomLevel');
    }

    //Need to trigger a redraw
    static down(){
        
        Math.floor(ZoomHandler.level--);
        if (ZoomHandler.level <= 1)
            ZoomHandler.level = 1;

        StateManager.emitEvent('zoomLevel');

    }
   
}


