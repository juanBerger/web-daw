
export class CanvasUtils {

    static scale (number: number, inMin: number, inMax: number, outMin: number, outMax: number) : number {
        return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    }

    /**
     * 
     * @param pixel - number to convert to canvas space
     * @param canvasWidth - total width of viewport in canvas units
     * @param pxixelWidth - total width of viewport in pixel units
     * @returns 
     */
    static PixelToCanvas(pixel: number, canvasMax: number, pixelMax: number) : number {

        const UNIT_RATIO = canvasMax / pixelMax;
        const halfCanvasMax = UNIT_RATIO * pixelMax * 0.5;
        return CanvasUtils.scale(pixel, 0, pixelMax, halfCanvasMax * -1, halfCanvasMax);
    
    }

}
