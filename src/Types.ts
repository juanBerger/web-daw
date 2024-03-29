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
    data: ArrayBuffer,
    views?: Float32Array[]

}

export interface PosCallback {
    ref: any,
    offsets: {l: number, t: number}
}

