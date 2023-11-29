import { useEffect, useState } from 'react';

import Clip from '../Clip/Clip';
import './ClipArea.css';

import { ClipConstructor, AssetConstructor } from '../Types';
import { Dispatcher } from '../Core/Dispatcher';
import { FileGetter } from '../Core/FileParser';


const TEST_CC = {
            
    clipId: 100, //ClipId should contain assetId
    assetId: 123,
    start: 100,
    leftTrim: 1,
    rightTrim: 2,
    volume: 3,
    mute: 4

}

const TEST_PATH = 'SCOR_SCORE_0218_02701_Roll_Out_The_Bank__a__30_STEM_(MELODY)_APM.wav';

// const TEST_AC = {
//     assetId: 12345,
//     data: new ArrayBuffer(100)
// }

export default function ClipArea(){

    const [clipConstructors, setClipConstructors] = useState<ClipConstructor[]>([]);

    //this will setClipConstructors on load according to presets?
    useEffect(() => {
        
        //For each asset
        // const fileGetter = new FileGetter();
        // const bytes = fileGetter.Parse(TEST_PATH);
        // console.log(bytes);
        // //assign Ids, create AC object
        
        // const ac = {
        //     assetId: 123,
        //     data: bytes
        // }

        //Dispatcher.CreateAssetMemory(ac);
        
        
        //For each clip
        Dispatcher.CreateClipMemory(TEST_CC);
        setClipConstructors([...clipConstructors, TEST_CC]);//each cc here renders a clip element
        
        

    }, [])


    return (
        <div id='ca-parent'>
            {clipConstructors.map(cc => 
                <Clip key={cc.clipId} cc={cc}/>
            )}
        </div>

    )

}