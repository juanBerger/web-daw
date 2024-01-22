/**
 * 
 * This should be renamed to be a generic mouse and keyboard handler class
 * 
 * 
 */


import { PosCallback } from "../Types";
import { ZoomHandler } from "./ZoomHandler";

export class MouseHandler {

    static clientX: number = 0;
    static clientY: number = 0;
    static leftDown: boolean = false;
    static posCallbacks: PosCallback[] = [];
 
    static init(){

        window.addEventListener('mousedown', e => {MouseHandler._handle(e)});
        window.addEventListener('mouseup', e => {MouseHandler._handle(e)});
        window.addEventListener('mousemove', e => {MouseHandler._handle(e)});
        window.addEventListener('keydown', e => {MouseHandler._handleKeyDown(e)});

    }

    static registerComponent(callback: PosCallback) {
        MouseHandler.posCallbacks.push(callback);
    }


    protected static _handleKeyDown(e: KeyboardEvent){

        switch (e.key){

            case '=':
                ZoomHandler.down(); //smaller number means lower fpp which means longer length
                break;
            
            case '-':
                ZoomHandler.up();
                break;

            //move spacebar listener to here as well

        }

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