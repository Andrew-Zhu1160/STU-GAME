import { Router} from "express";
import { rateLimit } from 'express-rate-limit';
import { param, query,body,validationResult } from 'express-validator';
import { validateInput,checkSession,validate } from '../generalMiddleware/validation.mjs';
import Player from '../schemas/playerSchema.mjs';
import { getBallGameSetting,expectedBallArrayLength,expectedPlatformArrayLength } from "../settingSheetFunctions/ballGameSettingSheetFunc.mjs";




const router = Router();





//must have safty check to make sure old user's array get updated to the correct length when new ball is added to the setting, otherwise it will cause unpredicted bugs


//edit here to add more balls


//very important migate old user fuction
//edit here to add more balls
async function migrateOldUserData(req,res,next){
    try{
        let thePlayer = await Player.findOne({playerName:req.session.playerName});
        if(!thePlayer){return res.status(404).json({message:'player not found'})}
        await thePlayer.save();

        //now do the migration
        thePlayer = await Player.findOne({playerName:req.session.playerName});
        if(!thePlayer){return res.status(404).json({message:'player not found'})};
        if(thePlayer.ballGameAssets.ballSelectionStatus.length<expectedBallArrayLength){
            //these are old data that needs expansion
            const lengthDifference = expectedBallArrayLength-thePlayer.ballGameAssets.ballSelectionStatus.length;
            for(let i=0;i<lengthDifference;++i){
                thePlayer.ballGameAssets.ballSelectionStatus.push(0);
            }
            thePlayer.markModified('ballGameAssets');
            await thePlayer.save();
        }
        next();
    }catch(error){
        if(error.name){
            if(error.name==='Version Error'){
                return res.status(400).json({message:'server busy'});
            }
            return res.status(500).json({message:'unknown error'});
        }
        return res.status(500).json({message:'internet error'})
    }

}


















const getUserBallStatusLimiter = rateLimit({windowMs: 2000, limit: 2 });
router.get(`/getUserBallStatus`,checkSession,
    getUserBallStatusLimiter,migrateOldUserData,async (req,res)=>{
        try{
            const thePlayer = await Player.findOne({playerName:req.session.playerName});
            if(!thePlayer){return res.sendStatus(404);}
            return res.status(200).json({data:thePlayer.ballGameAssets.ballSelectionStatus});
        }catch(error){
            return res.sendStatus(500);
        }
    }
);


const getBallGameSettingLimiter = rateLimit({windowMs: 1000, limit: 1 });
router.get(`/getBallGameSetting`,checkSession,getBallGameSettingLimiter,
    
    (req,res)=>{
        try{
            const ballGameSetting = getBallGameSetting();

            return res.status(200).json({data:ballGameSetting.balls});

        }catch(error){
            return res.sendStatus(500);
        }
    }
)


//edit here to add more ball
const changeBallStatusArrLimiter = rateLimit({windowMs: 1000, limit: 1,message: { message: " Action too frequent." } });
router.post(`/changeBallStatusArr`,checkSession, changeBallStatusArrLimiter,
    migrateOldUserData,

    body('purchasedBallNumber').exists().isInt({min:1,max:6}),
    body('mode').exists().isString(),
    body('selectedBallNumber').exists().isInt({min:1,max:6}),
    validateInput,
    async(req,res)=>{
        try{
            
            const ballGameSetting = getBallGameSetting();

            const thePlayer= await Player.findOne({playerName:req.session.playerName});
            if(!thePlayer){return res.status(401).json({message:'player no longer exist'})}
            if(req.body?.mode==='purchaseNewBall'){
                const ballCost = ballGameSetting.balls[req.body.purchasedBallNumber-1].cost;
                
                    //success
                    
                    thePlayer.speedCoins-=ballCost;
                    thePlayer.ballGameAssets.ballSelectionStatus[req.body.purchasedBallNumber-1]=1;
                    thePlayer.markModified('ballGameAssets');
                    await thePlayer.save();
                    return res.status(200).json({
                        data: thePlayer.ballGameAssets.ballSelectionStatus
                    });

                

            }else if(req.body?.mode==='selectBall'){
                for(let i=0;i<thePlayer.ballGameAssets.ballSelectionStatus.length;++i){
                    if(thePlayer.ballGameAssets.ballSelectionStatus[i]===2){
                        thePlayer.ballGameAssets.ballSelectionStatus[i]=1;

                    }
                }
                if(thePlayer.ballGameAssets.ballSelectionStatus[req.body.selectedBallNumber-1]===1){
                    thePlayer.ballGameAssets.ballSelectionStatus[req.body.selectedBallNumber-1]=2;
                }
                thePlayer.markModified('ballGameAssets');
                await thePlayer.save();
                return res.status(200).json({
                    data:thePlayer.ballGameAssets.ballSelectionStatus
                })



            }else{
                return res.status(400).json({message:'invalid mode'});
            }
        }catch(error){
            if(error.name){
                if(error.name==='ValidationError'){
                    return res.status(400).json({message:'not enough coins 😭'})

                }else if(error.name ==='VersionError'){
                    return res.status(400).json({message:'server busy, try again'})
                    
                }
                return res.status(500).json({message:'unknown error'})

            }
            return res.status(500).json({message:'unknown error,try again'})
        }

    });


    const getSelectedBallLimiter = rateLimit({windowMs: 1000, limit: 1 });
    router.get(`/getSelectedBall`,checkSession,getSelectedBallLimiter,
        migrateOldUserData,
        async(req,res)=>{
        try{
            const thePlayer = await Player.findOne({playerName:req.session.playerName});
            if(!thePlayer){return res.sendStatus(404)}
            return res.status(200).json({data:thePlayer.ballGameAssets.ballSelectionStatus});

        }catch(error){
            return res.sendStatus(500);

        }
    });

    const getPlatformSettingLimiter = rateLimit({windowMs: 1000, limit: 1 });
    router.get(`/getPlatformSetting`,checkSession,getPlatformSettingLimiter,
        async(req,res)=>{
        try{
            const ballGameSetting = getBallGameSetting();
            return res.status(200).json({data:ballGameSetting.platforms}); 
        }catch(error){
            return res.sendStatus(500);
        }
    });

    const updateBallGameScoreLimiter = rateLimit({windowMs:1000,limit:1});
    router.post(`/updateScore`,checkSession,updateBallGameScoreLimiter,
        body('newScore').exists().isInt({min:0,max:999999999}),
        validateInput,
        async (req,res)=>{
            try{
                const thePlayer = await Player.findOne({playerName:req.session.playerName});
                const {newScore}=req.body;
                if(!thePlayer){return res.status(404).json({message:'player no longer exist'})}
                if(thePlayer.ballGameAssets.highestScore<newScore){
                    thePlayer.ballGameAssets.highestScore = newScore;
                    thePlayer.markModified('ballGameAssets');
                    await thePlayer.save();
                    return res.status(201).json({newHighScore:newScore});

                }else{
                    return res.status(201).json({newHighScore:thePlayer.ballGameAssets.highestScore});


                }
            }catch(error){
                if(error.name){
                    if(error.name==='VersionError'){
                        return res.status(400).json({message:'server busy, request denined'});
                    }
                    return res.status(500).json({message:'unknown error'});
                }
                return res.status(500).json({message:'internet error'});
            }

        }
    );



    /*--------------------------------------
    end of ballGame route
    ---------------------------------------- */










export default router;