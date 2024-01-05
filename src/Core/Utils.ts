import { AudioData } from "../Types";
//declare const document: Document;

export function RandomInt32() : number {
    return Math.floor(Math.random() * Math.pow(2, 32));
}

export function RandomUInt8() : number {
    return Math.floor(Math.random() * (Math.pow(2, 8) - 1));
}

export function BytesToFrames(ad: AudioData) : number {
    
    const byteLength = ad.end - ad.start;
    if (byteLength < 0)
        throw Error('Clip length cant be negative');
    const samples = byteLength / (ad.dtype / 8);
    return samples / ad.channels;    

}



export function ScalePxToCanvas(pxNum: number, pxWidth: number, w_unit_ratio: number) : number{
    
    const scale = (number: number, inMin: number, inMax: number, outMin: number, outMax: number) => {
        return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    }
    
    const halfCanvasWidth = w_unit_ratio * pxWidth * 0.5;
    return scale(pxNum, 0, pxWidth, halfCanvasWidth * -1, halfCanvasWidth);

}



// export function PixelsToFrames(pixels: number, zoomLevel: string) : number {

//     let frames = 0;
//     switch (zoomLevel){

//         case "5":
//             frames = pixels * 100 
//             break;

//     }

//     return frames
// }

// /**
//  * 
//  * @param frames Number of audio frames to represent as pixels
//  * @param fullLength We draw our number of frames to fit in the current viewport. This replaces the current zoom level 
//  * @returns helps us draw a length when we know how many audio frames we want to represent. The result is scaled by the current zoom level
//  */
// export function FramesToPixels(frames: number, fullLength = false) : number {
    
//     let fpp: number | null = null;
//     if (fullLength){
//         fpp = Math.ceil(frames / document.getElementById('ca-parent')?.clientWidth)
//     }

//     else {
//         //get the fpp assoicated with the current zoom level and return the length in p
//     }
        

        
            
           
            
    
    

//     return pixels

// }