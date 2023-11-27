
import { useState } from "react"
import ClipArea from "./CipArea/ClipArea"

import { AudioGraph } from './Core/AudioGraph';

export default function App(){

    const [showStart, setShowStart] = useState<boolean>(true);
    
    const handleOnClick = async () => {
        
        if(showStart){
            await AudioGraph.init();
            await AudioGraph.audioContext.resume();
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