
import React from 'react';
import { useState } from 'react';
import './Clip.css'


export default function Clip(){

    const [isClicked, setIsClicked] = useState(false);


    const handleClick = () =>{
        setIsClicked(!isClicked);
    }

    const handleMouseMove = (e: React.MouseEvent) => {

        if (isClicked){

            console.log(e.clientX);
            const elem = document.querySelector('.c-parent') as HTMLElement;
            const pos = Number(elem.style.getPropertyValue('--x-translate')) + e.clientX; 
            elem.style.setProperty('--x-translate', String(pos) + 'px');
            console.log(elem.style.getPropertyValue('--x-translate'));
            
        }

        



    }



    return (
        <div className='c-parent' id='123' onClick={handleClick} onMouseMove={handleMouseMove}/>
    )


}