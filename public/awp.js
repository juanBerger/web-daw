
class AWP extends AudioWorkletProcessor {

    // Transport = {
        
    //     isPlaying: false,
    //     time: 0, //in samples
    
    //     /**
    //      * @param {*} pixelNum
    //      * @description: converts from pixel space to tranport space. This is called when user clicks around timeline
    //      */
    //     set: (pixelNum: number) => {

    //     },


    //     /**
    //      * 
    //      * @description: Increments transport position in samples, writes this to shared memory
    //      */
    //     tick: () => {

    //     }

    // };
    

    assets = {};


    constructor(){
        super();
    }

    onMessage = (e) => {

        if (e.data.assetMemory){
            const am = e.data.assetMemory;
            //this.assets[am.assetId] = am.data;

        }





        // if (e.data.newClip){


        // }

        // else if (e.data.transport_sab){
        //     console.log(e.data);
        //     this.transport_sab = e.data.transport_sab;

        // }
    }
    


    process(inputList, outputList, parameters){

        // if (this.Transport.isPlaying){
        //     this.Transport.tick();
        // }

        return true

    }

}

registerProcessor('awp', AWP);