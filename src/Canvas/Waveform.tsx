import { useEffect, useRef, useState } from "react"
import { ClipConstructor } from "../Core/ClipConstructor"
import { useThree, useFrame } from '@react-three/fiber';
import { Line } from "@react-three/drei";
import { CanvasUtils } from "./CanvasUtils";
import { Vector2 } from "three";
import { ZoomHandler } from "../Core/ZoomHandler";

export function Waveform(props: {cc: ClipConstructor}){ 
    
    const [points, setPoints] = useState<Vector2[]>([new Vector2(0, 0), new Vector2(0, 0)]);
    
    const lineRef = useRef<any>();

    //use the useFrame method here to check for updates in shared memory
    //you can get rms level from here etc.

    useFrame(() => {
        //
        setPosition();

    })

    
    function setPosition() {

        if (!lineRef.current)
            return;

        const x_world = CanvasUtils.scale(props.cc.left, 0, document.body.scrollWidth, document.body.scrollWidth / -2, document.body.scrollWidth / 2); //scrollWidth and height are essentially constants, but can change when overflow happens, so there needs to be events for that
        lineRef.current.position.x = x_world;

        const y_mid_px = props.cc.top + (props.cc.domRef.current.clientHeight / 2);
        const y_world = CanvasUtils.scale(y_mid_px, 0, document.body.scrollHeight, document.body.scrollHeight / 2, document.body.scrollHeight / -2);
        lineRef.current.position.y = y_world;

    }


    useEffect(() => {
        
        (async () => {


            const wfBuffer = await props.cc.getWaveform();
            const wf = new Float32Array(wfBuffer);

            const px_length = ZoomHandler.FramesToPixels(props.cc.length);
            const scaleFactor = px_length / wf.length;
            const clipHeight = props.cc.domRef.current.clientHeight;
            
            const vecs = []
            for (let i = 0; i < wf.length - 50; i++){
                const y = CanvasUtils.scale(wf[i], -1, 1, clipHeight / -2, clipHeight /2);
                vecs.push(new Vector2(i, y));
            }

            setPoints(vecs)
            if (lineRef.current){
                lineRef.current.scale.set(scaleFactor, 2, 1);
                setPosition();
            }

        })();

        
    }, [])

    return (
        <Line ref={lineRef} color={'pink'} points={points}/>
    )

}








//maybe get the waveform dynamically based on width of the clip, which can change with zoom change and with trimming.
//only with zoom do we consider re-getting the waveform
//const c_clipLength = CanvasUtils.PixelToCanvas(props.cc.length, viewport.width, size.width);


//console.log(props.cc.length, wf.length, scaleFactor, px_length)
//const clipHeight = props.cc.domRef.current.clientHeight;
//console.log(props.cc)
//const yMax = clip

// const c_clipHeight = CanvasUtils.PixelToCanvas(props.cc.domRef.current.clientHeight, viewport.height, size.height);
// const c_clipTop = CanvasUtils.PixelToCanvas(props.cc.top, viewport.height, size.height);

// const yMin = c_clipTop + c_clipHeight * -1;
// const yMax = c_clipTop * -1;

// //console.log(viewport.height, size.height);
// const pts = [];
// for (let i = 0; i < wf.length - 50; i++){ //fix this

//     //0 is defined by cc.top + height, height)
//     const c_x = CanvasUtils.PixelToCanvas(props.cc.left + i, viewport.width, size.width); 
    
//     //get vertical positoin of mid point between clips
//     const c_y = CanvasUtils.scale(wf[i], -1, 1, yMin, yMax); //this scales audio range to pixel range,
    
//     //const c_y = CanvasUtils.PixelToCanvas(p_scaledY, viewport.width, size.width); //this scales pixel range to canvas range
//     pts.push(new Vector2(c_x, c_y));
// }

// setPoints(pts);
// if (lineRef.current){
//     lineRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor);
//     const pos_x = CanvasUtils.PixelToCanvas(ZoomHandler.FramesToPixels(props.cc.left), viewport.width, size.width);
//     const pos_y = CanvasUtils.PixelToCanvas(props.cc.top, viewport.height, size.height);
//     // lineRef.current.position.x = pos_x + 220
//     // lineRef.current.position.y = pos_y

// }
