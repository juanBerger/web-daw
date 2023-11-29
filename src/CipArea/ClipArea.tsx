import { useEffect, useState } from 'react';

import { Dispatcher } from '../Core/Dispatcher';
import { ClipConstructor, AssetConstructor } from '../Types';
import Clip from '../Clip/Clip';
import './ClipArea.css';


const TEST_CC = {
            
    clipId: 100, //ClipId should contain assetId
    assetId: 200,
    start: 100,
    leftTrim: 1,
    rightTrim: 2,
    volume: 3,
    mute: 4

}

const TEST_AC = {
    assetId: 12345,
    data: new ArrayBuffer(100)
}

export default function ClipArea(){

    const [clipConstructors, setClipConstructors] = useState<ClipConstructor[]>([]);

    //this will setClipConstructors on load according to presets?
    useEffect(() => {
        
        //For each clip
        Dispatcher.CreateClipMemory(TEST_CC);
        setClipConstructors([...clipConstructors, TEST_CC]);//each cc here renders a clip element
        
        //For each asset
        Dispatcher.CreateAssetMemory(TEST_AC);

    }, [])


    return (
        <div id='ca-parent'>
            {clipConstructors.map(cc => 
                <Clip key={cc.clipId} cc={cc}/>
            )}
        </div>

    )

}