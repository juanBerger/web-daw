
import { useState } from "react"

import { Canvas } from '@react-three/fiber'
import { Playhead } from "./Canvas/Playhead";

import { ClipArea } from "./CipArea/ClipArea"
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
            
            
            UIListener.init(AudioGraph.awp); //set up render loop (listens for changes that originate in the audio process)
            MouseHandler.init();

            setShowStart(!showStart);
        }        
    }

    return (
        <>
            {showStart && <button id='startButton' onClick={handleOnClick}>Start</button>}
            {!showStart && <ClipArea/>}
            {!showStart && <div id='canvasRoot' style={{
                position: 'absolute',
                top: '0px',
                left: '0px',
                height: '100%',
                width: '100%'
            }}>
                <Canvas>
                    <ambientLight intensity={0.1} />
                    <directionalLight color="red" position={[0, 0, 5]} />
                    <Playhead/>
                </Canvas>
            </div>}          
        </>
    )



}