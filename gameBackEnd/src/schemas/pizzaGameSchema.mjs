import mongoose from 'mongoose';


const pizzaGameSchema = new mongoose.Schema({

    Name:{type:String,default:'unknown',unique:true},

    sks:{type:[{
        number:{type:Number},
        cost:{type:Number},
        width:{type:Number},
        height:{type:Number},
        damage:{type:Number},
    }],default:[{
        number:1,
        cost:0,
        width:190,
        height:190,
        damage:1,
    },
    {
        number:2,
        cost:156700,
        width:190,
        height:190,
        damage:2,
    },
    {
        number:3,
        cost:250000,
        width:190,
        height:190,
        damage:3,
    },
    {
        number:4,
        cost:306000,
        width:190,
        height:190,
        damage:4,
    }
     ]},

     pizzas:{type:[{
        width:{type:Number},
        height:{type:Number},
    }],default:[{
        width:350,
        height:350, 
    },
    {
        width:350,
        height:350, 
    },
    {
        width:350,
        height:350, 
    },
    {
        width:350,
        height:350, 
    },
    {
        width:350,
        height:350, 
    },
    {
        width:350,
        height:350, 
    },
    {
        width:350,
        height:350, 
    }
]}


});

const PizzaGameConfig = mongoose.model('PizzaGameConfig',pizzaGameSchema);
export default PizzaGameConfig;