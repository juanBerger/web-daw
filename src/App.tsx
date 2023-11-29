
import { useState } from "react"
import ClipArea from "./CipArea/ClipArea"

import { AudioGraph } from './Core/AudioGraph';
import { UIListener } from "./Core/UIListener";
import { FileGetter } from "./Core/FileParser";

export default function App(){

    const [showStart, setShowStart] = useState<boolean>(true);

    const handleOnClick = async () => {    
        if(showStart){
            
            //set up audio process
            await AudioGraph.init();
            await AudioGraph.audioContext.resume();
            
            //set up render loop (listens for changes that originate in the audio process)
            UIListener.init(AudioGraph.awp); //this should listen to File Parser messages maybe?

            //set up file parser
            //FileGetter.init();

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