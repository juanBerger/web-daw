
import { useState, MouseEvent } from 'react';
import { Dispatcher } from '../Core/Dispatcher';
import './Clip.css'

import { ClipConstructor } from '../Types';

export default function Clip(props: {cc: ClipConstructor}) {


    //const [canSlide, setCanSlide] = useState(false);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [start, setStart] = useState(String(props.cc.start) + 'px');


    const handleMouseDown = (e: MouseEvent) =>{
        e.preventDefault();
        setIsMouseDown(!isMouseDown);
        
    }

    const handleMouseUp = (e: MouseEvent) =>{
        e.preventDefault();
        setIsMouseDown(!isMouseDown);       
    }


    const handleMouseMove = (e: MouseEvent) => {
        
        e.preventDefault();

        if (isMouseDown){
            Dispatcher.updateClipX(e.clientX);
            setStart(String(e.clientX) + 'px');
        }

    }

    return (
        <div className='c-parent' 
            id={String(props.cc.clipId)} 
            style={{['--x-left' as any]: start}}
            onMouseUp={handleMouseUp} 
            onMouseDown={handleMouseDown} 
            onMouseMove={handleMouseMove}>
            <p>{isMouseDown}</p>
        </div>
    )


}




        // if (isClicked){

            

        //     console.log(e.clientX);
        //     const elem = document.querySelector('.c-parent') as HTMLElement;
        //     const pos = Number(elem.style.getPropertyValue('--x-translate')) + e.clientX; 
        //     elem.style.setProperty('--x-translate', String(pos) + 'px');
        //     console.log(elem.style.getPropertyValue('--x-translate'));
            
        // }

        

