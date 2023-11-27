

/**
 * 
 * size: data size in bytes
 * 
 */
export interface ClipConstructor {
    
    clipId: number,
    assetId: number,
    start: number,
    leftTrim: number,
    rightTrim: number,
    volume: number,
    mute: number,

}


export interface AssetConstructor {

    assetId: number,
    data: ArrayBuffer
}


export interface AssetMessage {
    

}


