import mongoose from 'mongoose';

const ballGameSchema = new mongoose.Schema({
    Name:{type:String,default:'unknown',unique:true},

    //edit here to add balls
    balls:{type: [{
            number: { type: Number },
            cost: { type: Number },
            width: { type: Number },
            height: { type: Number },
            friction: { type: Number },
            density: { type: Number }
        }],default:[{
            number:1,
            cost:0,
            width:200,
            height:200,
            friction:1,
            density:0.003
            },
            {
            number:2,
            cost:200000,
            width:180,
            height:180,
            friction:1.3,
            density:0.0035
            },
            {
            number:3,
            cost:500000,
            width:200,
            height:200,
            friction:1.2,
            density:0.003
            },
            {
            number:4,
            cost:1000000,
            width:200,
            height:200,
            friction:1.4,
            density:0.0035
            },
    
    ]},

    platforms:{type:[{
        friction:{type:Number},
    }],default:[
        {friction:1199},
        {friction:999},
        {friction:700},
    
    ]}





});
const BallGameConfig = mongoose.model('BallGameConfig',ballGameSchema);
export default BallGameConfig













