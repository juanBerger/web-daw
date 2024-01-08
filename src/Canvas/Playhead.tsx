import { useRef } from "react";

import { useFrame } from "@react-three/fiber";
import { useThree } from '@react-three/fiber';
import { Mesh } from 'three';
import { ScalePxToCanvas } from "../Core/Utils";

import { TCMemory } from "../Core/TCMemory"
import { ZoomHandler } from "../Core/ZoomHandler";

/**
 * Some informative discussion?
 * https://github.com/pmndrs/react-three-fiber/issues/1892
 */

export function Playhead() {

    //Get Ratios For Converting between three.js space and pixel space
    const { viewport, size } = useThree();
    const W_UNIT_RATIO = viewport.width / size.width;
    const H_UNIT_RATIO = viewport.height / size.height;
    
    //Design - all these are in pixels
    const HEIGHT_SHRINK = 30;  //this is in pixels, just for appearance
    const WIDTH = 1;

    //Positioning
    const playHead = useRef<Mesh>(null!);    
    
    useFrame(() => {
        //const tc = TCMemory.sync();0
        const pxPos = ZoomHandler.FramesToPixels(TCMemory.tc);
        const canvasPos = ScalePxToCanvas(pxPos, size.width, W_UNIT_RATIO);
        playHead.current.position.x = canvasPos;    
    })

    return ( 
        <mesh position={[ScalePxToCanvas(0, size.width, W_UNIT_RATIO),0,0]} ref={playHead}>
            <boxGeometry args={[WIDTH * W_UNIT_RATIO, H_UNIT_RATIO * (size.height - HEIGHT_SHRINK), 0]}/>
            <meshLambertMaterial color="hotpink" transparent/>
        </mesh>
    )

}
