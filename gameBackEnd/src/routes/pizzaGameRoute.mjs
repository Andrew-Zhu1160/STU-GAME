import { Router} from "express";
import { rateLimit } from 'express-rate-limit';
import { param, query,body,validationResult } from 'express-validator';
import { validateInput,checkSession,validate } from '../generalMiddleware/validation.mjs';
import Player from '../schemas/playerSchema.mjs';
import { getPizzaGameSetting,expectedSkArrayLength,expectedPizzaArrayLength } from "../settingSheetFunctions/pizzaGameSettingSheetFunc.mjs";



const router = Router();



async function migrateOldUserData_pizzaGame(req,res,next){
        try{
            let thePlayer = await Player.findOne({playerName:req.session.playerName});
            if(!thePlayer){return res.status(404).json({message:'player not found'})};
            if(thePlayer.pizzaGameAssets.skSelectionStatus.length<expectedSkArrayLength){
                const lengthDifference = expectedSkArrayLength-thePlayer.pizzaGameAssets.skSelectionStatus.length;
                for(let i=0;i<lengthDifference;++i){
                    thePlayer.pizzaGameAssets.skSelectionStatus.push(0);
                }
                thePlayer.markModified('pizzaGameAssets');
                await thePlayer.save();
            }
            next();

        }catch(error){
            if(error.name){
                if(error.name==='VersionError'){
                    return res.status(400).json({message:'server busy, request denied'});
                }
                return res.status(500).json({message:'unknown error'});
            }
            return res.status(500).json({message:'internet error, try again'});
        }

    }

    

    const getUserSkStatusLimiter = rateLimit({windowMs: 1000, limit: 1 });
    router.get(`/getUserSkStatus`,checkSession,getUserSkStatusLimiter,
        migrateOldUserData_pizzaGame,
        async(req,res)=>{
        try{
            const thePlayer = await Player.findOne({playerName:req.session.playerName});
            if(!thePlayer){return res.status(404).json({message:'player not found'})};
            return res.status(200).json({data:thePlayer.pizzaGameAssets.skSelectionStatus});
        }catch(error){
            return res.sendStatus(500);
        }
    });


    const getPizzaGameSettingLimiter = rateLimit({windowMs: 1000, limit: 1 });
    router.get(`/getPizzaGameSetting`,checkSession,getPizzaGameSettingLimiter,
        
        (req,res)=>{
            try{
                const pizzaGameSetting = getPizzaGameSetting();
                return res.status(200).json({data:pizzaGameSetting.sks})
            }catch(error){
                return res.sendStatus(500);

            }
        }
    )

    const changeSkStatusArrLimiter = rateLimit({windowMs:1000,limit:1,message: { message: " Action too frequent." }});
    router.post(`/changeSkStatusArr`,checkSession,
        changeSkStatusArrLimiter,
        migrateOldUserData_pizzaGame,
        
        body('mode').exists().isString(),
        body('purchasedSkNumber').exists().isInt({min:1,max:4}),
        body('selectedSkNumber').exists().isInt({min:1,max:4}),
        validateInput,
        async(req,res)=>{
            try{
                const pizzaGameSetting = getPizzaGameSetting();
                
                const thePlayer= await Player.findOne({playerName:req.session.playerName});
                if(!thePlayer){return res.status(404).json({message:'player no longer exists'});}
                if(req.body?.mode === "purchaseNewSk"){
                    const skCost = pizzaGameSetting.sks[req.body.purchasedSkNumber-1].cost;
                    thePlayer.speedCoins-=skCost;
                    thePlayer.pizzaGameAssets.skSelectionStatus[req.body.purchasedSkNumber-1]=1;
                    thePlayer.markModified('pizzaGameAssets');
                    await thePlayer.save();
                    return res.status(200).json({
                        data:thePlayer.pizzaGameAssets.skSelectionStatus
                    })

                }else if (req.body?.mode==="selectSk"){
                    for(let i =0;i<thePlayer.pizzaGameAssets.skSelectionStatus.length;++i){
                        if(thePlayer.pizzaGameAssets.skSelectionStatus[i]===2){
                            thePlayer.pizzaGameAssets.skSelectionStatus[i]=1;
                        }
                    }
                    if (thePlayer.pizzaGameAssets.skSelectionStatus[req.body.selectedSkNumber-1]===1){
                        thePlayer.pizzaGameAssets.skSelectionStatus[req.body.selectedSkNumber-1]=2;
                    }
                    await thePlayer.save();
                    return res.status(200).json({
                        data:thePlayer.pizzaGameAssets.skSelectionStatus
                    });

                }else{
                    return res.status(400).json({message:"invalid mode"})
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
        }
    );



    const getPizzaGameSetting2Limiter = rateLimit({windowMs: 1000, limit: 1 });
    router.get(`/getPizzaGameSetting2`,checkSession,getPizzaGameSetting2Limiter,
        async(req,res)=>{
            try{
                const pizzaGameSetting = getPizzaGameSetting();
                return res.status(200).json({data:pizzaGameSetting.pizzas});
            }catch(error){
                return res.sendStatus(500);
            }
        }
    );





    const updatePizzaGameScoreLimiter = rateLimit({windowMs:1000,limit:1});
    router.post(`/updateScore`,checkSession,updatePizzaGameScoreLimiter,
        body('newScore').exists().isInt({min:0,max:999999999}),
        validateInput,
        async (req,res)=>{
            try{
                const thePlayer = await Player.findOne({playerName:req.session.playerName});
                const {newScore}=req.body;
                if(!thePlayer){return res.status(404).json({message:'player no longer exist'})}
                if(thePlayer.pizzaGameAssets.highestScore<newScore){
                    thePlayer.pizzaGameAssets.highestScore = newScore;
                    thePlayer.markModified('pizzaGameAssets');
                    await thePlayer.save();
                    return res.status(201).json({newHighScore:newScore});

                }else{
                    return res.status(201).json({newHighScore:thePlayer.pizzaGameAssets.highestScore});


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
    end of pizzaGame route
    ---------------------------------------- */

    
    



export default router;