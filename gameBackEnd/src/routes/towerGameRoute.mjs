import { Router} from "express";
import { rateLimit } from 'express-rate-limit';
import { param, query,body,validationResult } from 'express-validator';
import { validateInput,checkSession,validate } from '../generalMiddleware/validation.mjs';
import Player from '../schemas/playerSchema.mjs';
import { getTowerGameSetting } from '../settingSheetFunctions/towerGameSettingSheetFunc.mjs';



const router = Router();


//specfic limitter
const speedClickLimiter = rateLimit({
    windowMs: 2000, // 2 seconds
    limit: 2,       // 1 action per 2 seconds
    message: { 
        message: " Action too frequent." 
    }
});




router.get('/towerShop', async(req,res)=>{
    try{
        if(req.session.playerName){
            const playerData = await Player.findOne({ playerName: req.session.playerName });
            //add this line to every rute basically. copy the refernce of the setting sheet to here and use it to get the data for response. it throw error if the setting sheet is not initialized for some reason, which will be caught by the catch block and return 500 error.
            const towerGameSetting =  getTowerGameSetting();

            if(towerGameSetting){
            const responseObj= {
                tower1:{
                    damage:towerGameSetting.towerLv1.damage,
                    cost:towerGameSetting.towerLv1.cost,
                    owned:playerData.towerGameAssets.Lv1towers
                },
                tower2:{
                    damage:towerGameSetting.towerLv2.damage,
                    cost:towerGameSetting.towerLv2.cost,
                    owned:playerData.towerGameAssets.Lv2towers
                },
                tower3:{
                    damage:towerGameSetting.towerLv3.damage,
                    cost:towerGameSetting.towerLv3.cost,
                    owned:playerData.towerGameAssets.Lv3towers
                },
                tower4:{
                    damage:towerGameSetting.towerLv4.damage,
                    cost:towerGameSetting.towerLv4.cost,
                    owned:playerData.towerGameAssets.Lv4towers
                },
                tower5:{
                    damage:towerGameSetting.towerLv5.damage,
                    cost:towerGameSetting.towerLv5.cost,
                    owned:playerData.towerGameAssets.Lv5towers
                },
                tower6:{
                    damage:towerGameSetting.towerLv6.damage,
                    cost:towerGameSetting.towerLv6.cost,
                    owned:playerData.towerGameAssets.Lv6towers
                },
                tower7:{
                    damage:towerGameSetting.towerLv7.damage,
                    cost:towerGameSetting.towerLv7.cost,
                    owned:playerData.towerGameAssets.Lv7towers
                },
                tower8:{
                    damage:towerGameSetting.towerLv8.damage,
                    cost:towerGameSetting.towerLv8.cost,
                    owned:playerData.towerGameAssets.Lv8towers
                },
                tower9:{
                    damage:towerGameSetting.towerLv9.damage,
                    cost:towerGameSetting.towerLv9.cost,
                    owned:playerData.towerGameAssets.Lv9towers
                },
                tower10:{
                    damage:towerGameSetting.towerLv10.damage,
                    cost:towerGameSetting.towerLv10.cost,
                    owned:playerData.towerGameAssets.Lv10towers
                },
                tower11:{
                    damage:towerGameSetting.towerLv11.damage,
                    cost:towerGameSetting.towerLv11.cost,
                    owned:playerData.towerGameAssets.Lv11towers
                },
                tower12:{
                    damage:towerGameSetting.towerLv12.damage,
                    cost:towerGameSetting.towerLv12.cost,
                    owned:playerData.towerGameAssets.Lv12towers
                },
            };
            return res.status(201).json(responseObj);
            
            //.....................
            //edit here to add more towers
            //.........................


            }else{
                return res.sendStatus(404);
            }
    }else{
        return res.sendStatus(404);

    }


    }catch(error){
         console.error(error);
        return res.sendStatus(500);
    }

});



router.post('/addTower',[
    speedClickLimiter, 
    body('purchasedTowerLevel').isInt({ min: 1, max: 12 }),
    validate
    ],async (req,res)=>{
    try{

    const towerGameSetting =  getTowerGameSetting();

    if(!req.session.playerName){
        return res.sendStatus(404);
    }
    const thePlayer = await Player.findOne({playerName:req.session.playerName});
    if(!thePlayer||!towerGameSetting){
        return res.sendStatus(404);
    }

    
        const {purchasedTowerLevel} = req.body;
        const towerCostArr=[towerGameSetting.towerLv1.cost,
                            towerGameSetting.towerLv2.cost,
                            towerGameSetting.towerLv3.cost,
                            towerGameSetting.towerLv4.cost,
                            towerGameSetting.towerLv5.cost,
                            towerGameSetting.towerLv6.cost,
                            towerGameSetting.towerLv7.cost,
                            towerGameSetting.towerLv8.cost,
                            towerGameSetting.towerLv9.cost,
                            towerGameSetting.towerLv10.cost,
                            towerGameSetting.towerLv11.cost,
                            towerGameSetting.towerLv12.cost
        ];
        if(thePlayer.speedCoins<towerCostArr[purchasedTowerLevel-1]){
            return res.sendStatus(400);

        }
        //....................
        //edit here to add more towers
        //...................


        switch(purchasedTowerLevel){
            case 1:
                thePlayer.towerGameAssets.Lv1towers++;
                thePlayer.speedCoins-=towerGameSetting.towerLv1.cost;
                break;
            case 2:
                thePlayer.towerGameAssets.Lv2towers++;
                thePlayer.speedCoins-=towerGameSetting.towerLv2.cost;
                break;
            case 3:
                thePlayer.towerGameAssets.Lv3towers++;
                thePlayer.speedCoins-=towerGameSetting.towerLv3.cost;
                break;
            case 4:
                thePlayer.towerGameAssets.Lv4towers++;
                thePlayer.speedCoins-=towerGameSetting.towerLv4.cost;
                break;
            case 5:
                thePlayer.towerGameAssets.Lv5towers++;
                thePlayer.speedCoins-=towerGameSetting.towerLv5.cost;
                break;
            case 6:
                thePlayer.towerGameAssets.Lv6towers++;
                thePlayer.speedCoins-=towerGameSetting.towerLv6.cost;
                break;
            case 7:
                thePlayer.towerGameAssets.Lv7towers++;
                thePlayer.speedCoins-=towerGameSetting.towerLv7.cost;
                break;
            case 8:
                thePlayer.towerGameAssets.Lv8towers++;
                thePlayer.speedCoins-=towerGameSetting.towerLv8.cost;
                break;
            case 9:
                thePlayer.towerGameAssets.Lv9towers++;
                thePlayer.speedCoins-=towerGameSetting.towerLv9.cost;
                break;
            case 10:
                thePlayer.towerGameAssets.Lv10towers++;
                thePlayer.speedCoins-=towerGameSetting.towerLv10.cost;
                break;
            case 11:
                thePlayer.towerGameAssets.Lv11towers++;
                thePlayer.speedCoins-=towerGameSetting.towerLv11.cost;
                break;
            case 12:
                thePlayer.towerGameAssets.Lv12towers++;
                thePlayer.speedCoins-=towerGameSetting.towerLv12.cost;
                break;
            default:break;
            //edit here to add more towers

    }
    thePlayer.markModified('towerGameAssets');
    thePlayer.markModified('speedCoins');
    await thePlayer.save();
    return res.sendStatus(201);


    }catch(error){
        console.log(error);
        return res.sendStatus(500);

    }   
})


router.get('/getUserTowerCollection',async (req,res)=>{
    if(!req.session.playerName){
        return res.sendStatus(404);
    }
    const thePlayer = await Player.findOne({playerName:req.session.playerName});
    if(!thePlayer){
        return res.sendStatus(404);
    }
    try{
        

        return res.status(201).json({
            towerCollection:[
                thePlayer.towerGameAssets.Lv1towers,
                thePlayer.towerGameAssets.Lv2towers,
                thePlayer.towerGameAssets.Lv3towers,
                thePlayer.towerGameAssets.Lv4towers,
                thePlayer.towerGameAssets.Lv5towers,
                thePlayer.towerGameAssets.Lv6towers,
                thePlayer.towerGameAssets.Lv7towers,
                thePlayer.towerGameAssets.Lv8towers,
                thePlayer.towerGameAssets.Lv9towers,
                thePlayer.towerGameAssets.Lv10towers,
                thePlayer.towerGameAssets.Lv11towers,
                thePlayer.towerGameAssets.Lv12towers,
            ],
            towerLayout:thePlayer.towerGameAssets.towerDeployLayout
        })
        //.......................
        //edit here to add more tower
        //.....................

    }catch(error){
        return res.sendStatus(500);
    }
});


router.post('/editTowerDeploy',[
    body('updatedDeploy').isArray({ min: 3, max: 3 }),
    body('updatedDeploy.*').isInt({ min: 0, max: 12 }),
    validate
],async (req,res)=>{
    //...................
    //edit here to add more tower
    //.................
    if(!req.session.playerName){
        return res.sendStatus(404);
    }
    const thePlayer = await Player.findOne({playerName:req.session.playerName});
    if(!thePlayer){
        return res.sendStatus(404);
    }
    if(req.body.updatedDeploy.length!==3){
        return res.sendStatus(400);
    }
    try{
        thePlayer.towerGameAssets.towerDeployLayout=req.body.updatedDeploy;
        await thePlayer.save();
        return res.sendStatus(201);
    }catch(error){
        return res.sendStatus(500);
    }
    

});







router.get('/getTowerDeploy',async (req,res)=>{
    if(!req.session.playerName){
        return res.sendStatus(404);
    }
    try{
        //no need for null check, the function will throw error if setting shet is null, getter is the only sync function
        const towerGameSetting =  getTowerGameSetting();

        const thePlayer = await Player.findOne({playerName:req.session.playerName});
        if(!thePlayer){
            return res.sendStatus(404);
        }
        const userTowerArr= [...thePlayer.towerGameAssets.towerDeployLayout];
        const towerSettingRef = [{...towerGameSetting.towerLv1},
                                {...towerGameSetting.towerLv2},
                                {...towerGameSetting.towerLv3},
                                {...towerGameSetting.towerLv4},
                                {...towerGameSetting.towerLv5},
                                {...towerGameSetting.towerLv6},
                                {...towerGameSetting.towerLv7},
                                {...towerGameSetting.towerLv8},
                                {...towerGameSetting.towerLv9},
                                {...towerGameSetting.towerLv10},
                                {...towerGameSetting.towerLv11},
                                {...towerGameSetting.towerLv12},
        ];
        //..........................
        //edit here to add more tower
        //..........................
        let towerInitArr=[];
        for(let i=0;i<userTowerArr.length;++i){
            if(userTowerArr[i]===0){
                towerInitArr.push(null);
                continue;
            }
            towerInitArr.push({
                towerLevel:userTowerArr[i],
                towerDamage:towerSettingRef[userTowerArr[i]-1].damage,
                towerHp:towerSettingRef[userTowerArr[i]-1].hp,
                towerCurrentHp:towerSettingRef[userTowerArr[i]-1].hp,
                towerFireDelay:towerSettingRef[userTowerArr[i]-1].fireDelay,
                towerBulletPerRound:towerSettingRef[userTowerArr[i]-1].numOfBulletsPerRound,
                towerAngleInitial:userTowerArr[i]===1?15:userTowerArr[i]===2||userTowerArr[i]===3?90:0,
                towerAngle:0,
                towerDisplayHp:towerSettingRef[userTowerArr[i]-1].hp

            });
        }
        return res.status(201).json(towerInitArr);









    }catch(error){
        return res.sendStatus(500);

    }
});

router.get('/getEnemyAttribute',(req,res)=>{
    if(!req.session.playerName){
        return res.sendStatus(404);
    }
    try{
         const towerGameSetting =  getTowerGameSetting();

        if(!towerGameSetting){
            return res.sendStatus(404);
        }
        const enemySettingRef=[{...towerGameSetting.enemyLv1},
                                {...towerGameSetting.enemyLv2},
                                {...towerGameSetting.enemyLv3},
                                {...towerGameSetting.enemyLv4}
        ];
        let enemyInitArr=[];
        for(let i=0;i<enemySettingRef.length;++i){
            enemyInitArr.push({
                enemyLevel:i+1,
                enemyHp:enemySettingRef[i].hp,
                
                isDead:false,
                enemyDmg:enemySettingRef[i].attackDmg,
                enemyCoinDrop:enemySettingRef[i].coinDrop

            });



        }
        return res.status(201).json(enemyInitArr);



    }catch(error){
        return res.sendStatus(500);
    }
});


router.get('/getCoinsAndScores',async (req,res)=>{
    if(!req.session.playerName){
        return res.sendStatus(404);
    }
    try{
        const thePlayer = await Player.findOne({playerName:req.session.playerName});
        if(!thePlayer){
            return res.sendStatus(404);
        }
        return res.status(201).json({
            
            highestScoreRecord:thePlayer.towerGameAssets.highestScore
        })


    }catch(error){
        return res.sendStatus(500);
    }
});





router.post('/addCoins',[
    body('coinAddAmount').isInt({ min: 1, max: 20000 })
        .withMessage('Invalid coin amount'),
    validate
],async (req,res)=>{
    if(!req.session.playerName){
        return res.sendStatus(404);
    }
    try{
    const thePlayer = await Player.findOne({playerName:req.session.playerName});
    if(!thePlayer){
        return res.sendStatus(404);
    }
    thePlayer.speedCoins += req.body.coinAddAmount;
    await thePlayer.save();
    return res.sendStatus(201);

    }catch(error){
        return res.sendStatus(500);
    }
});






router.post('/updateScoreRecord',[
    speedClickLimiter,
    body('newScore').isInt({ min: 0, max: 999999999 }),
    validate
],async(req,res)=>{
    if(!req.session.playerName){
        return res.sendStatus(404);

    }
    try{
    const thePlayer = await Player.findOne({playerName:req.session.playerName});
    if(req.body.newScore>thePlayer.towerGameAssets.highestScore){
        thePlayer.towerGameAssets.highestScore = req.body.newScore;
        thePlayer.markModified('towerGameAssets');
        await thePlayer.save();
        return res.status(201).json({
            currentHighestScore:req.body.newScore
        })
    }else{
        return res.status(201).json({
            currentHighestScore:thePlayer.towerGameAssets.highestScore
        });
    }

    }catch(error){
        return res.sendStatus(500)
    }

});



//-----------------------------------
//end of towergame route!!!!
//----------------------------------








export default router;
