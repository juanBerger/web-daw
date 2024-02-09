import { useRef } from "react";
import { Mesh } from 'three';

import { useFrame, useThree } from "@react-three/fiber";
import { ScalePxToCanvas } from "../Core/Utils";
import { CanvasUtils } from "./CanvasUtils";

import { TCMemory } from "../Core/TCMemory"
import { ZoomHandler } from "../Core/ZoomHandler";

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
        const pos_px = ZoomHandler.FramesToPixels(TCMemory.tc);
        const pos_world = CanvasUtils.scale(pos_px, 0,document.body.scrollWidth, document.body.scrollWidth / -2, document.body.scrollWidth / 2);
        
        //const canvasPos = ScalePxToCanvas(pxPos, size.width, W_UNIT_RATIO);
        //const pos_world = CanvasUtils.PixelToCanvas(pos_px, viewport.width, size.width);
       
        playHead.current.position.x = pos_world;    
    })

    return ( 
        <mesh position={[ScalePxToCanvas(0, size.width, W_UNIT_RATIO),0,0]} ref={playHead}>
            <boxGeometry args={[WIDTH * W_UNIT_RATIO, H_UNIT_RATIO * (size.height - HEIGHT_SHRINK), 0]}/>
            <meshLambertMaterial color="hotpink" transparent/>
        </mesh>
    )

}
