import { useEffect, useState } from "react"
import { ClipConstructor } from "../Core/ClipConstructor"
import { useThree } from '@react-three/fiber';
import { Line } from "@react-three/drei";
import { CanvasUtils } from "./CanvasUtils";
import { Vector2 } from "three";

export function Waveform(props: {cc: ClipConstructor}){ 
    
    const { viewport, size } = useThree();
    const [points, setPoints] = useState<Vector2[]>([new Vector2(0, 0), new Vector2(0, 0)]);

    //use the useFrame method here to check for updates in shared memory
    //you can get rms level from here etc.

    
    useEffect(() => {
        
        (async () => {

            const wfBuffer = await props.cc.getWaveform();
            const wf = new Float32Array(wfBuffer);
            
            const c_clipHeight = CanvasUtils.PixelToCanvas(props.cc.domRef.current.clientHeight, viewport.height, size.height);
            const c_clipTop = CanvasUtils.PixelToCanvas(props.cc.top, viewport.height, size.height);
            
            console.log(props.cc.domRef.current.clientHeight, props.cc.top);
            console.log(c_clipTop, c_clipHeight)
            
            const yMin = c_clipTop + c_clipHeight * -1;
            const yMax = c_clipTop * -1;
            console.log(yMin, yMax)

            const pts = [];
            for (let i = 0; i < wf.length; i++){

                //0 is defined by cc.top + height, height)
                const c_x = CanvasUtils.PixelToCanvas(props.cc.left + i, viewport.width, size.width);
                
                
                
                //get vertical positoin of mid point between clips

                const c_y = CanvasUtils.scale(wf[i], -1, 1, yMin, yMax); //this scales audio range to pixel range,
                //const c_y = CanvasUtils.PixelToCanvas(p_scaledY, viewport.width, size.width); //this scales pixel range to canvas range
                pts.push(new Vector2(c_x, c_y));
            }
            //const pts = [new Vector2(start, 0), new Vector2(start + 10, 0)];
            setPoints(pts);
        })();


    }, [])

    return (
    <Line color={'white'} points={points}/>
    //[[0.1,0], [-1, 4]]
    // <></>
    )

}

 //maybe get the waveform dynamically based on width of the clip, which can change with zoom change and with trimming.
            //only with zoom do we consider re-getting the waveform
            //const c_clipLength = CanvasUtils.PixelToCanvas(props.cc.length, viewport.width, size.width);