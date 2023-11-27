
import { useState } from "react"
import ClipArea from "./CipArea/ClipArea"



// const ag = new AudioGraph();
// await ag.generateAWP('./Core/awp.js');
// const dispatcher = new Dispatcher(ag.awp);

export default function App(){

    const [showStart, setShowStart] = useState<boolean>(true);
    
    
    const handleOnClick = async () => {
        
        setShowStart(!showStart)
    }


    //conditionally render clipArea after button pressed


    return (
        <>
            {showStart && <button id='startButton' onClick={handleOnClick}>Start</button>}
            {!showStart && <ClipArea/>} 
        </>
    )



}