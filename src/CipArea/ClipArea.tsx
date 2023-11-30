import { useEffect, useState } from 'react';

import Clip from '../Clip/Clip';
import './ClipArea.css';

import { ClipConstructor } from '../Types';
import { Dispatcher } from '../Core/Dispatcher';
import { FileOpener } from '../Core/FileOpener';

const TEST_CC = {
            
    clipId: 100, //ClipId should contain assetId
    assetId: 123,
    start: 100,
    leftTrim: 1,
    rightTrim: 2,
    volume: 3,
    mute: 4

}

const TEST_FILES = [
    'SCOR_SCORE_0218_02701_Roll_Out_The_Bank__a__30_STEM_(808)_APM.wav',
    'SCOR_SCORE_0218_02701_Roll_Out_The_Bank__a__30_STEM_(HOOK)_APM.wav',
    'SCOR_SCORE_0218_02701_Roll_Out_The_Bank__a__30_STEM_(MELODY)_APM.wav',
    'SCOR_SCORE_0218_02701_Roll_Out_The_Bank__a__30_STEM_(MONEY_GUN)_APM.wav',
    'SCOR_SCORE_0218_02701_Roll_Out_The_Bank__a__30_STEM_(PERC)_APM.wav',
    'SCOR_SCORE_0218_02701_Roll_Out_The_Bank__a__30_STEM_(VERSE)_APM.wav'
]

export default function ClipArea(){

    const [clipConstructors, setClipConstructors] = useState<ClipConstructor[]>([]);


    //this will setClipConstructors on load according to presets?
    useEffect(() => {
        
        //Asset paths
        FileOpener.Open(TEST_FILES); //takes an array of paths
        
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