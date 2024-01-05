
import { useState } from "react"

import { Canvas } from '@react-three/fiber'
import { useFrame } from "@react-three/fiber";
import { Playhead } from "./Canvas/Playhead";

import { ClipArea } from "./CipArea/ClipArea"
import { AudioGraph } from './Core/AudioGraph';
import { TCMemory } from "./Core/TCMemory";
import { MouseHandler } from "./Core/MouseHandler";



/**
 * useFrame is called before r3f's next frame render. 
 * this is basically the same as requestAnimation frame. It's ok call useFrame inside of many components
 */
function TCListener(){

    useFrame(() => {
        TCMemory.sync();
    })

    return <></>
}

//z position of 400 makes the unit 1 roughly about 1 px
export default function App(){

    const [showStart, setShowStart] = useState<boolean>(true);

    const handleOnClick = async () => {    
        
        if(showStart){
            
            //set up audio process
            await AudioGraph.init();
            await AudioGraph.audioContext.resume();
            
            TCMemory.init(AudioGraph.awp); //set up render loop (listens for changes that originate in the audio process)
            MouseHandler.init();

            setShowStart(!showStart);
        }        
    }

    return (
        
        <>
            {showStart && <button id='startButton' onClick={handleOnClick}>Start</button>}
            {!showStart && <div id='canvasRoot' style={{
                position: 'absolute',
                top: '0px',
                left: '0px',
                height: '100%',
                width: '100%'
            }}>
                <Canvas camera={{position: [0,0, 5]}}> 
                    <ambientLight intensity={0.6} />
                    <directionalLight intensity={0.6} position={[0, 0, 5]} />
                    <Playhead/>
                    <TCListener/>
                </Canvas>
            </div>}  
            {!showStart && <ClipArea/>}        
        </>
    )

}