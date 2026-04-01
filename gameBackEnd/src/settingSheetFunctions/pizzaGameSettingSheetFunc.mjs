import PizzaGameConfig from "../schemas/pizzaGameSchema.mjs";

let pizzaGameSetting= null;

export const expectedSkArrayLength = 4;
export const expectedPizzaArrayLength = 7;

export async function initPizzaGameSetting(){
    try{
        //do not need to initialize again if the setting is already initialized, this is to avoid unnecessary database query and also to avoid potential bugs that may cause the setting to be initialized multiple times
        if(pizzaGameSetting){return;}
        
        pizzaGameSetting = await PizzaGameConfig.findOne({Name:"pizzaGameSettingSheet"});
        //create the setting sheet for the very first time
        if(!pizzaGameSetting){
            pizzaGameSetting = new PizzaGameConfig({Name:"pizzaGameSettingSheet"});
            await pizzaGameSetting.save();
        }
        //expand length of the pizza setting array if the setting is old and does not have enough pizza settings, this is for future proofing when we want to add more pi
        if(pizzaGameSetting.sks.length<expectedSkArrayLength||
                pizzaGameSetting.pizzas.length<expectedPizzaArrayLength
            ){
                const lengthDifference = expectedSkArrayLength-pizzaGameSetting.sks.length;
                const baseDamage = pizzaGameSetting.sks[pizzaGameSetting.sks.length-1].damage;
                for(let i=0;i<lengthDifference;++i){
                    pizzaGameSetting.sks.push({
                        number:i+1,
                        cost:100000,
                        width:190,
                        height:190,
                        damage:baseDamage+i
                    });
                }
                const lengthDifference2 = expectedPizzaArrayLength-pizzaGameSetting.pizzas.length;
                for(let i=0;i<lengthDifference2;++i){
                    pizzaGameSetting.pizzas.push({
                        width:450,
                        height:450, 
                    });
                }
                pizzaGameSetting.markModified('sks');
                pizzaGameSetting.markModified('pizzas');
                await pizzaGameSetting.save();
            }
    }catch(error){
        console.error("Error initializing pizza game setting:", error);
        throw error;
    }
}

export function getPizzaGameSetting(){
    if(!pizzaGameSetting){
        throw new Error("Pizza game setting not initialized");
    }
    return pizzaGameSetting;
}

export async function updatePizzaGameSetting(){
    try{
        const newPizzaGameSetting = await PizzaGameConfig.findOne({Name:"pizzaGameSettingSheet"});
        if(newPizzaGameSetting){
            pizzaGameSetting = newPizzaGameSetting;
        }
    }catch(error){
        console.error("Error updating pizza game setting:", error);
        throw error;
    }
}