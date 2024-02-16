
/**
 * 
 * This needs a cleanup function for unmounting
 * 
 */

import { useState, useRef, MouseEvent, useEffect } from 'react';
import { MouseHandler } from '../Core/MouseHandler';
import { ClipConstructor } from '../Core/ClipConstructor';
import { ZoomHandler } from '../Core/ZoomHandler';
import { StateManager } from '../Core/StateManager';
import WaveSurfer from 'wavesurfer.js'

//import { CanvasUtils } from "../Canvas/CanvasUtils";

import './Clip.css'
import { AudioGraph } from '../Core/AudioGraph';

export default function Clip(props: {cc: ClipConstructor}) {

    const [left, setLeft] = useState(String(props.cc.left) + 'px');
    const [top, setTop] = useState(String(props.cc.top) + 'px');
    const [length, setLength] = useState(String(ZoomHandler.FramesToPixels(props.cc.length)) + 'px');
    
    const clipRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        
        StateManager.zoomLevelCallbacks.push(handleZoomChange);
        props.cc.setDomRef(clipRef);
        
        (async () => {
            const wfBuffer = await props.cc.getWaveform();
            const wf = new Float32Array(wfBuffer);

            const waveSurfer = WaveSurfer.create({
                container: "#-wf-" + String(props.cc.clipId),
                waveColor: 'rgb(200, 0, 200)',
                progressColor: 'rgb(100, 0, 100)',
                peaks: [wf],
                height: 60, //this is hardcoded in the css for the parent div for now
                duration: props.cc.length / AudioGraph.audioContext.sampleRate
            })
            
            waveSurfer.unAll();

        })();

        

    }, []);

    const handleZoomChange = () => {
        setLength(String(ZoomHandler.FramesToPixels(props.cc.length)) + 'px');
    }

    const handleMouseDown = (e: MouseEvent) => {
        
        e.preventDefault();
        
        if (clipRef.current){
            const lOffset = e.clientX - clipRef.current.getBoundingClientRect().left;
            const tOffset = e.clientY - clipRef.current.getBoundingClientRect().top;
            MouseHandler.registerComponent({ref: updatePosition, offsets: {l: lOffset, t: tOffset}});
        }
    }

    const updatePosition = (l: number, t: number) : void => {
        
        setLeft(String(l) + 'px');
        setTop(String(t) + 'px'); 
        props.cc.syncPosition(l, t);
        
    }

    return (
        <>
            <div ref={clipRef} className='c-parent' 
                id={String(props.cc.clipId)} 
                style={{['--x' as any]: left, ['--y' as any]: top, ['--length' as any]: length}}
                onMouseDown={handleMouseDown}
                >
                {/* <canvas id={String(props.cc.clipId) + '-cnv'} className='wf' width='100%' height='100%'/> */}
                <div id={"-wf-" + String(props.cc.clipId)}/>

            </div>
        </>
    )


}
//viewBox='0 0 1800 60'

//  {/* <p>I'm a clip</p> */}
//  <svg width='100%' height='100%' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 6000 400'>
//  <path stroke="rgba(255, 221, 239, 0.8)" fill="transparent" d={path}/>
// </svg>


 // const wfBuffer = await props.cc.getWaveform();
// const wf = new Float32Array(wfBuffer);

// //const y_min = props.cc.domRef.current.clientHeight;
// const y_min = 500;
// const y_max = 0;

// let path = '';
// for (let i = 0; i < wf.length; i++){
    
//     const y = CanvasUtils.scale(wf[i], -1, 1, y_min, y_max);
//     const prefix = i === 0 ? 'M0' : 'L' + String(i);
//     path += prefix + ' ' + y + ' '; 
        
// }


// const svgStr = `<svg width='100%' height='100%' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 6000 400'>
//     <path stroke="rgba(255, 221, 239, 0.8)" fill="transparent" d={path}/>
// </svg>`

// const p = new Path2D(path);
// const canvas = document.getElementById(String(props.cc.clipId) + '-cnv') as HTMLCanvasElement


/**
 * the size of this canvas should be the natural size of the waveform, taking into account what we have decided will be the stride
 * in realtiy this is not the correct location for this.
 */
// if (canvas){
//     const ctx = canvas.getContext('2d');
//     if (ctx)
//         ctx.fill(p);
// }

// const canvas = document.createElement('canvas');
// canvas.width = imageBitmap.width;
// canvas.height = imageBitmap.height;
// const ctx = canvas.getContext('2d');
// ctx.drawImage(imageBitmap, 0, 0);

//setPath(path);