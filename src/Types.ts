
// export interface ClipConstructor {
    
//     clipId: number,
//     assetId: number,
//     left: number,
//     top: number,
//     leftTrim: number,
//     rightTrim: number,
//     volume: number,
//     mute: number,
// }

export interface ClipMemory {
    [key: number] : Uint8Array
}

/**
 * start, end refer to indexes of 'data'. This accounts for headers and meta data chunks at the end
 */
export interface AudioData {

    assetId: number,
    channels: number,
    sampleRate: number,
    dtype: number,
    start: number,
    end: number,
    data: ArrayBuffer

}

export interface PosCallback {
    ref: any,
    offsets: {l: number, t: number}
}


