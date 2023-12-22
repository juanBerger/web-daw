
import { useState, useRef, MouseEvent } from 'react';
import { MouseHandler } from '../Core/MouseHandler';
import { ClipConstructor } from '../Core/ClipConstructor';
import { FramesToPixels, PixelsToFrames } from '../Core/Utils';

import './Clip.css'


export default function Clip(props: {cc: ClipConstructor}) {

    const [left, setLeft] = useState(String(props.cc.left) + 'px');
    const [top, setTop] = useState(String(props.cc.top) + 'px');
    const clipRef = useRef<HTMLDivElement>(null);

    const handleMouseLeave = (e: MouseEvent) => {

        
        
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


    const handleMouseMove = (e: MouseEvent) => {
        //Not used?
    }

    return (
        <div ref={clipRef} className='c-parent' 
            id={String(props.cc.clipId)} 
            style={{['--x' as any]: left, ['--y' as any]: top, ['--length' as any]: String(FramesToPixels(props.cc.length, 'full-length')) + 'px'}}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}>
            <p>I'm a clip</p>
        </div>
    )


}
