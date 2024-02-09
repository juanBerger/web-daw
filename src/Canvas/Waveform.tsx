import { useEffect, useRef, useState } from "react"
import { ClipConstructor } from "../Core/ClipConstructor"
import { useThree, useFrame } from '@react-three/fiber';
import { Line } from "@react-three/drei";
import { CanvasUtils } from "./CanvasUtils";
import { Vector2, Vector3 } from "three";
import { ZoomHandler } from "../Core/ZoomHandler";
import { ScalePxToCanvas } from "../Core/Utils";

export function Waveform(props: {cc: ClipConstructor}){ 
    
    const { viewport, size } = useThree();
    
    //const [position, setPosition] = useState<Vector3>(new Vector3(0, 0, 0));
    const [points, setPoints] = useState<Vector2[]>([new Vector2(0, 0), new Vector2(0, 0)]);
    
    const lineRef = useRef<any>();

    //use the useFrame method here to check for updates in shared memory
    //you can get rms level from here etc.
    
    useEffect(() => {
        
        (async () => {


            const wfBuffer = await props.cc.getWaveform();
            const wf = new Float32Array(wfBuffer);

            const px_length = ZoomHandler.FramesToPixels(props.cc.length);
            const scaleFactor = px_length / wf.length; 
            //console.log(props.cc.length, wf.length, scaleFactor, px_length)
            

            const c_clipHeight = CanvasUtils.PixelToCanvas(props.cc.domRef.current.clientHeight, viewport.height, size.height);
            const c_clipTop = CanvasUtils.PixelToCanvas(props.cc.top, viewport.height, size.height);
            
            const yMin = c_clipTop + c_clipHeight * -1;
            const yMax = c_clipTop * -1;
            
            //console.log(viewport.height, size.height);
            const pts = [];
            for (let i = 0; i < wf.length - 50; i++){ //fix this

                //0 is defined by cc.top + height, height)
                const c_x = CanvasUtils.PixelToCanvas(props.cc.left + i, viewport.width, size.width); 
                
                //get vertical positoin of mid point between clips
                const c_y = CanvasUtils.scale(wf[i], -1, 1, yMin, yMax); //this scales audio range to pixel range,
                
                //const c_y = CanvasUtils.PixelToCanvas(p_scaledY, viewport.width, size.width); //this scales pixel range to canvas range
                pts.push(new Vector2(c_x, c_y));
            }
            
            setPoints(pts);
            if (lineRef.current){
                lineRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor);
                const pos_x = CanvasUtils.PixelToCanvas(ZoomHandler.FramesToPixels(props.cc.left), viewport.width, size.width);
                const pos_y = CanvasUtils.PixelToCanvas(props.cc.top, viewport.height, size.height);
                lineRef.current.position.x = pos_x + 220
                lineRef.current.position.y = pos_y
                
                //lineRef.current.position.x = CanvasUtils.PixelToCanvas(ZoomHandler.FramesToPixels(props.cc.left), viewport.width, size.width) + 232;
                //lineRef.current.position.y = (CanvasUtils.PixelToCanvas(props.cc.top, viewport.height, size.height) + 83) * -1;
            }
         
            

        })();

        
    }, [])

    return (
        <Line ref={lineRef} color={'pink'} points={points}/>
        // <></>
    )

}

//maybe get the waveform dynamically based on width of the clip, which can change with zoom change and with trimming.
//only with zoom do we consider re-getting the waveform
//const c_clipLength = CanvasUtils.PixelToCanvas(props.cc.length, viewport.width, size.width);


/**SVG */
// const y_min = -1;
// const y_max = 1;

// let path = '';
// for (let i = 0; i < wf.length; i++){
    
//     const y = CanvasUtils.scale(wf[i], -1, 1, y_min, y_max);
//     const prefix = i === 0 ? 'M0' : 'L' + String(i);
//     path += prefix + ' ' + y + ' '; 
        
// }
// const svgStr = `<svg width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'>
//     <path stroke="rgba(255, 221, 239, 0.8)" fill="transparent" d=${path}/></svg>`

//const svgStr = `<svg role="img" xmlns="http://www.w3.org/2000/svg"</svg>`

//setSvg(svgStr);
//console.log(svgStr, viewport, size);
/** */