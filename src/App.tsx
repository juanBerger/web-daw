
import { useState } from "react"
import ClipArea from "./CipArea/ClipArea"

import { AudioGraph } from './Core/AudioGraph';
import { UIListener } from "./Core/UIListener";

export default function App(){

    const [showStart, setShowStart] = useState<boolean>(true);

    const handleOnClick = async () => {    
        if(showStart){
            
            await AudioGraph.init();
            await AudioGraph.audioContext.resume();
            UIListener.init(AudioGraph.awp);
            setShowStart(!showStart);
        }        
    }

    return (
        <>
            {showStart && <button id='startButton' onClick={handleOnClick}>Start</button>}
            {!showStart && <ClipArea/>} 
        </>
    )



}