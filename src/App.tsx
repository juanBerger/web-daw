
import { useState } from "react"
import ClipArea from "./CipArea/ClipArea"

import { AudioGraph } from './Core/AudioGraph';
import { UIListener } from "./Core/UIListener";
import { MouseHandler } from "./Core/MouseHandler";

export default function App(){

    const [showStart, setShowStart] = useState<boolean>(true);

    const handleOnClick = async () => {    
        
        if(showStart){
            
            //set up audio process
            await AudioGraph.init();
            await AudioGraph.audioContext.resume();
            
            //set up render loop (listens for changes that originate in the audio process)
            UIListener.init(AudioGraph.awp); //this should listen to File Parser messages maybe?
            MouseHandler.init();

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