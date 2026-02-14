import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({

    playerName:{type:String, 
                unique:true},
    playerPassword:{type:String},

    speedCoins:{type:Number,default:0,
        min:[0,"coins cannot be negative"]
    },


    
    towerGameAssets:{
        Lv1towers: { type: Number, default: 1 },
        Lv2towers: { type: Number, default: 0 },
        Lv3towers: { type: Number, default: 0 },
        Lv4towers: { type: Number, default: 0 },
        Lv5towers: { type: Number, default: 0 },
        Lv6towers: { type: Number, default: 0 },
        Lv7towers: { type: Number, default: 0 },
        Lv8towers: { type: Number, default: 0 },
        Lv9towers: { type: Number, default: 0 },
        Lv10towers: { type: Number, default: 0 },
        Lv11towers: { type: Number, default: 0 },
        Lv12towers: { type: Number, default: 0 },


        
        highestScore: { type: Number, default: 0 },

        towerDeployLayout:{type:[{type:Number,min:0,max:12}],default:[1,0,0]}

        

    },




    ballGameAssets:{
        //edit here to add more ball
        ballSelectionStatus:{type:[{type:Number,
            min:[0,"invalid entry"],
            max:[2,"invalid index"]
        }],default:[2,0,0,0,0,0]},

        highestScore:{type:Number,default:0}
        //edit here when add more balls



    }










},{ 
    optimisticConcurrency: true //prevent race codition
});
const Player = mongoose.model('Player',playerSchema);
export default Player;