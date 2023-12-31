
import { useState, useRef, MouseEvent, useEffect } from 'react';
import { MouseHandler } from '../Core/MouseHandler';
import { ClipConstructor } from '../Core/ClipConstructor';
import { ZoomHandler } from '../Core/ZoomHandler';
import { StateManager } from '../Core/StateManager';

import './Clip.css'

export default function Clip(props: {cc: ClipConstructor}) {

    const [left, setLeft] = useState(String(props.cc.left) + 'px');
    const [top, setTop] = useState(String(props.cc.top) + 'px');
    const [length, setLength] = useState(String(ZoomHandler.FramesToPixels(props.cc.length)) + 'px');
    const clipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        StateManager.zoomLevelCallbacks.push(handleZoomChange);
    }, []);

    const handleZoomChange = () => {
        setLength(String(ZoomHandler.FramesToPixels(props.cc.length)) + 'px');
    }

    // const handleMouseLeave = (e: MouseEvent) => {
    //     
    // }

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


    // const handleMouseMove = (e: MouseEvent) => {
    //     //Not used?
    // }

    return (
        <div ref={clipRef} className='c-parent' 
            id={String(props.cc.clipId)} 
            style={{['--x' as any]: left, ['--y' as any]: top, ['--length' as any]: length}}
            onMouseDown={handleMouseDown}
            // onMouseLeave={handleMouseLeave}
            // onMouseMove={handleMouseMove}
            >
            <p>I'm a clip</p>
        </div>
    )


}
