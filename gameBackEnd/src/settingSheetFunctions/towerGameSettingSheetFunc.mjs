import TowerGameConfig from '../schemas/towerGameSchema.mjs';

let towerGameSetting= null;

export async function initTowerGameSetting(){
    try{
        if(towerGameSetting){return;}
        
        towerGameSetting = await TowerGameConfig.findOne({Name:"towerGameSettingSheet"});
        if(!towerGameSetting){
            towerGameSetting = new TowerGameConfig({Name:"towerGameSettingSheet"});
            await towerGameSetting.save();
        }

    }catch(error){
        console.error("Error initializing tower game setting:", error);
        throw error;
    }
}

export function getTowerGameSetting(){
    if(!towerGameSetting){
        throw new Error("Tower game setting not initialized");
    }
    return towerGameSetting;
}



export async function updateTowerGameSetting(){
    try{
        const newTowerGameSetting = await TowerGameConfig.findOne({Name:"towerGameSettingSheet"});
        if(newTowerGameSetting){
            towerGameSetting = newTowerGameSetting;
        }
    }catch(error){
        console.error("Error updating tower game setting:", error);
        throw error;
    }
}


