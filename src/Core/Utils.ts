import { AudioData } from "../Types";
declare const document: Document;

export function RandomInt32() : number {
    return Math.floor(Math.random() * Math.pow(2, 32));
}

export function BytesToFrames(ad: AudioData) : number {
    
    const byteLength = ad.end - ad.start;
    if (byteLength < 0)
        throw Error('Clip length cant be negative');
    const samples = byteLength / (ad.dtype / 8);
    return samples / ad.channels;    

}

export function FramesToPixels(frames: number, zoomLevel: string) : number {

    let pixels = 200;
    switch (zoomLevel){

        case 'full-length':
            const viewport = document.getElementById('ca-parent');
            if (viewport)
                pixels = Math.floor(frames / viewport?.clientWidth);
            console.log(pixels)
            break;
    }

    return pixels


}