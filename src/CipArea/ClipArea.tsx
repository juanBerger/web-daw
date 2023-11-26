import { useEffect, useState } from 'react'
import Clip from '../Clip/Clip'
import './ClipArea.css'

import { ClipConstructor } from '../Types';
import { Dispatcher } from '../Core/Dispatcher';

export default function ClipArea(){

    const [clipConstructors, setClipConstructors] = useState<ClipConstructor[]>([]);

    //this will setClipConstructors on load according to presets?
    useEffect(() => {
        setClipConstructors([...clipConstructors, {
            clipId: 100,
            start: 100,
            leftTrim: 0,
            rightTrim: 0,
            volume: 0,
            mute: 0
        }]);

    }, [])


    return (
        <div id='ca-parent'>
            {clipConstructors.map(cc => 
                <Clip key={cc.clipId} cc={cc}/>
            )}
        </div>

    )

}