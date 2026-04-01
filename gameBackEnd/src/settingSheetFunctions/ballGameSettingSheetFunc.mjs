import BallGameConfig from "../schemas/ballGameSchema.mjs";

let ballGameSetting= null;

export const expectedBallArrayLength = 6;
export const expectedPlatformArrayLength = 3;

export async function initBallGameSetting(){
    try{
        //do not need to initialize again if the setting is already initialized, this is to avoid unnecessary database query and also to avoid potential bugs that may cause the setting to be initialized multiple times
        if(ballGameSetting){return;}

        
        ballGameSetting = await BallGameConfig.findOne({Name:"ballGameSettingSheet"});
        //if for the very first time, create a new setting sheet
        if(!ballGameSetting){
            ballGameSetting = new BallGameConfig({Name:"ballGameSettingSheet"});
            await ballGameSetting.save();
        }

        
        //check if the old setting sheet has enough ball and platform settings, if not add default ones
        if(ballGameSetting.balls.length<expectedBallArrayLength||
            ballGameSetting.platforms.length<expectedPlatformArrayLength){
            const lengthDifference = expectedBallArrayLength-ballGameSetting.balls.length;
            for(let i=0; i<lengthDifference;++i){
                //push a average ball setting
                ballGameSetting.balls.push({
                    cost:1000000,
                    width:200,
                    height:200,
                    friction:1.2,
                    density:0.0035
                });
            }
            const lengthDifference2 = expectedPlatformArrayLength-ballGameSetting.platforms.length;
            for(let i =0;i<lengthDifference2;++i){
                //push a default platform
                ballGameSetting.platforms.push({
                    friction:1000
                });
            }
            ballGameSetting.markModified('balls');
            ballGameSetting.markModified('platforms');
            await ballGameSetting.save();
        }

    }catch(error){
        console.error("Error initializing ball game setting:", error);
        throw error;
    }
}

export function getBallGameSetting(){
    if(!ballGameSetting){
        throw new Error("Ball game setting not initialized");
    }
    return ballGameSetting;
}

export async function updateBallGameSetting(){
    try{
        const newBallGameSetting = await BallGameConfig.findOne({Name:"ballGameSettingSheet"});
        if(newBallGameSetting){
            ballGameSetting = newBallGameSetting;
        }
    }catch(error){
        console.error("Error updating ball game setting:", error);
        throw error;
    }
}

 