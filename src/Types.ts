
export interface ClipConstructor {
    
    clipId: number,
    assetId: number,
    start: number,
    leftTrim: number,
    rightTrim: number,
    volume: number,
    mute: number,

}

export interface ClipMemory {
    [key: number] : Uint8Array
}

export interface AudioData {

    assetId: string,
    channels: number,
    sampleRate: number,
    dtype: number,
    start: number,
    end: number,
    data: ArrayBuffer

}


