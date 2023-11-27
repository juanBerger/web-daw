import { useEffect, useState } from 'react';

import { ClipConstructor, AssetConstructor } from '../Types';
import { Dispatcher } from '../Core/Dispatcher';
import { AudioGraph } from '../Core/AudioGraph';

import Clip from '../Clip/Clip';
import './ClipArea.css';


const TEST_CC = {
            
    clipId: 100,
    assetId: 123,
    start: 100,
    leftTrim: 0,
    rightTrim: 0,
    volume: 0,
    mute: 0

}

export default function ClipArea(){

    const [clipConstructors, setClipConstructors] = useState<ClipConstructor[]>([]);

    //this will setClipConstructors on load according to presets?
    useEffect(() => {
        
        //Turn the clip constructors into clips
        setClipConstructors([...clipConstructors, TEST_CC]);


    }, [])


    return (
        <div id='ca-parent'>
            {clipConstructors.map(cc => 
                <Clip key={cc.clipId} cc={cc}/>
            )}
        </div>

    )

}