import { useEffect, useState } from 'react';

import Clip from '../Clip/Clip';
import './ClipArea.css';

import { FileOpener } from '../Core/FileOpener';
import { ClipConstructor } from '../Core/ClipConstructor';

const TEST_FILES = [
    'SCOR_SCORE_0218_02701_Roll_Out_The_Bank__a__30_STEM_(808)_APM.wav',
    // 'SCOR_SCORE_0218_02701_Roll_Out_The_Bank__a__30_STEM_(HOOK)_APM.wav',
    'SCOR_SCORE_0218_02701_Roll_Out_The_Bank__a__30_STEM_(MELODY)_APM.wav',
    'SCOR_SCORE_0218_02701_Roll_Out_The_Bank__a__30_STEM_(MONEY_GUN)_APM.wav',
    'SCOR_SCORE_0218_02701_Roll_Out_The_Bank__a__30_STEM_(PERC)_APM.wav',
    // 'SCOR_SCORE_0218_02701_Roll_Out_The_Bank__a__30_STEM_(VERSE)_APM.wav'
]

export function ClipArea(){

    const [clipConstructors, setClipConstructors] = useState<ClipConstructor[]>([]);

    useEffect(() => {
        
        (async () => {
            const ccs = await FileOpener.OpenAndGenerateClips(TEST_FILES);
            setClipConstructors(ccs);

        })();

    }, [])


    //[...clipConstructors, newClip]


    return (
        <>            
            <div id='ca-parent'>
                {clipConstructors.map(cc => 
                    <Clip key={cc.clipId} cc={cc}/>
                )}
            </div>
        </>
    )

}