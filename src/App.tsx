
import { useState, useEffect, useRef } from "react"
import { Canvas, useFrame } from '@react-three/fiber'
import { OrthographicCamera } from "@react-three/drei";

import { Playhead } from "./Canvas/Playhead";
import { Waveform } from "./Canvas/Waveform"

import { ClipArea } from "./CipArea/ClipArea"
import { AudioGraph } from './Core/AudioGraph';
import { TCMemory } from "./Core/TCMemory";
import { MouseHandler } from "./Core/MouseHandler";
import { ClipConstructor } from "./Core/ClipConstructor";
import './App.css'

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

export default function App(){

    const [showStart, setShowStart] = useState<boolean>(true);
    const [waveforms, setWaveforms] = useState<ClipConstructor[]>([]);
    const [cameraArgs, setCameraArgs] = useState<any>();
    const canvasRef = useRef<any>();
    const cameraRef = useRef<any>();

    
    useEffect(() => {
        setCameraArgs([document.body.scrollWidth / -2, document.body.scrollWidth / 2, document.body.scrollHeight / 2, document.body.scrollHeight / -2, 1, 1000]);
    }, [document.body.scrollWidth, document.body.scrollHeight]); //


    const handleOnClick = async () => {    
        
        if(showStart){

            // console.log(cameraRef)
            // cameraRef.current.left = -document.body.scrollWidth / 2;
            // cameraRef.current.right = document.body.scrollWidth / 2;
            // cameraRef.current.top = document.body.scrollHeight / 2;
            // cameraRef.current.bottom = -document.body.scrollHeight / 2;
            // cameraRef.current.updateProjectionMatrix(); --> Use this when we fire an event
            
            //set up audio process
            await AudioGraph.init();
            await AudioGraph.audioContext.resume();
            
            TCMemory.init(AudioGraph.awp);
            MouseHandler.init();

            setShowStart(!showStart);
        }        
    }

    const canvasBridge = (ccs: ClipConstructor[]) => {
        setWaveforms(ccs);
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
                <Canvas ref={canvasRef}>
                    
                    <OrthographicCamera makeDefault ref={cameraRef} position={[0, 0, 1]} args={cameraArgs}/>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    
                    <Playhead/>
                    <TCListener/>
                    {waveforms?.map(cc =><Waveform key={cc.clipId} cc={cc}/>)}
                    
                </Canvas>
            </div>}  
            
            {!showStart && <ClipArea canvasBridge={canvasBridge}/>}        
        </>
    )

}