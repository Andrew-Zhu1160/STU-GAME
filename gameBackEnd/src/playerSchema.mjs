import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({

    playerName:{type:String, 
                unique:true},
    playerPassword:{type:String},

    speedCoins:{type:Number,default:0},


    
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


        
        highestScore: { type: Number, default: 0 },

        towerDeployLayout:{type:[Number],default:[0,0,0]}

        

    }


































});
const Player = mongoose.model('Player',playerSchema);
export default Player;