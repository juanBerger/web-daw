


export abstract class Dispatcher {
    
    constructor(){

    }


    protected _createSAB(size: number) : Uint8Array {

        const sab = new SharedArrayBuffer(size);
        return new Uint8Array(sab);
    }



    public static newClip() : void { 
        //create new memory location that describes the following attributes

    }

    public static updateClipX(x: number) : void {
        
    }

};




