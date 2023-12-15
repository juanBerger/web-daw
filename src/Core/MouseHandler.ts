
import { PosCallback } from "../Types";

export class MouseHandler {

    static clientX: number = 0;
    static clientY: number = 0;
    static leftDown: boolean = false;
    static posCallbacks: PosCallback[] = [];
 

    static init(){

        window.addEventListener('mousedown', e => {MouseHandler._handle(e)});
        window.addEventListener('mouseup', e => {MouseHandler._handle(e)});
        window.addEventListener('mousemove', e => {MouseHandler._handle(e)});

    }

    static registerComponent(callback: PosCallback) {
        MouseHandler.posCallbacks.push(callback);
    }

    protected static _handle(e: MouseEvent){
        
        e.preventDefault();

        switch(e.type){
            
            case 'mousemove':
                if (MouseHandler.posCallbacks.length > 0)
                    MouseHandler.posCallbacks.forEach((callback: PosCallback) => {
                        callback.ref(e.clientX - callback.offsets.l, e.clientY - callback.offsets.t)
                    });
                break;

            case 'mousedown':
                MouseHandler.leftDown = true;
                break;

            case 'mouseup': 
                
                MouseHandler.leftDown = false;
                
                if (MouseHandler.posCallbacks.length > 0)
                    MouseHandler.posCallbacks = [];

                break;
            
        }
    


    }

}