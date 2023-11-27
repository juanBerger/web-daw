import { useEffect, useState } from 'react';

import { Dispatcher } from '../Core/Dispatcher';
import { ClipConstructor, AssetConstructor } from '../Types';
import Clip from '../Clip/Clip';
import './ClipArea.css';


const TEST_CC = {
            
    clipId: 100, //maybe this should  hold the asset id in it in some way
    assetId: 12345,
    start: 100,
    leftTrim: 0,
    rightTrim: 0,
    volume: 0,
    mute: 0

}

const TEST_AC = {
    assetId: 12345,
    data: new ArrayBuffer(100)
}

export default function ClipArea(){

    const [clipConstructors, setClipConstructors] = useState<ClipConstructor[]>([]);
    const [assetConstructors, setAssetConstructors] = useState<AssetConstructor[]>([]);

    //this will setClipConstructors on load according to presets?
    useEffect(() => {
        
        //Turn clipConstructors into Clips and AssetConstructors into assets
        setClipConstructors([...clipConstructors, TEST_CC]);
        setAssetConstructors([...assetConstructors, TEST_AC]);



    }, [])


    return (
        <div id='ca-parent'>
            {clipConstructors.map(cc => 
                <Clip key={cc.clipId} cc={cc}/>
            )}
        </div>

    )

}