
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


export interface AssetConstructor {
    assetId: number,
    data: ArrayBuffer
}

//File Handling
export interface AudioData {

    channels: number,
    sampleRate: number,
    dtype: number,
    start: number,
    end: number,
    data: ArrayBuffer

}


