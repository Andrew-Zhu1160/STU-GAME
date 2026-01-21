import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { param, query,body,validationResult } from 'express-validator';
import session from 'express-session';
import 'dotenv/config'


//import userschema
import Player from './playerSchema.mjs';
//import towerGameCofig
import TowerGameConfig from './towerGameSchema.mjs';

//pasword hashing functions
import {hashPassword,verifyPassword} from './passwordScure.mjs';

//for anti spam and safty
import MongoStore from 'connect-mongo';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';






const app = express();
//for production
app.set('trust proxy', 1);
//production block end

app.use(helmet());




app.use(express.json({ limit: '10kb' }));
app.use(cors({
    
    origin: process.env.REACT_URL,
    
    //very important to allow cookies from react front end
    credentials: true,               
    
    // Optional but recommended: define allowed methods
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    
    // 4. Ensure headers like Content-Type are allowed
    allowedHeaders: ['Content-Type', 'Authorization']


}));
app.use(session({
    
    secret:process.env.SESSION_SECRET,
    
    saveUninitialized:false,
    
    resave:false,
    
    //for production
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL,

        ttl: 14 * 24 * 60 * 60,
    }),
    //production block end
    
    cookie:{
        httpOnly:true,
        //for production
        maxAge:1000 * 60 * 60 * 24 * 7,
        secure:process.env.NODE_ENV==='production',
        sameSite:process.env.NODE_ENV === 'production' ? 'none' : 'lax'
        //production block end





        
    }


}));


//moved order
try{
    await mongoose.connect(process.env.MONGODB_URL,{
        //for production
        maxPoolSize:20,
        serverSelectionTimeoutMS: 5000
        //production block end
    });
    console.log('connected');
}catch(error){
    console.log(error);
}


//get the towerGameStats from DB

let towerGameSetting = await TowerGameConfig.findOne({Name:"towerGameSettingSheet"});
if(!towerGameSetting){
    towerGameSetting = new TowerGameConfig({Name:"towerGameSettingSheet"});
}
//any changes to the setting before save goes here?

await towerGameSetting.save();


















//rate limit:
const globalLimiter = rateLimit({
    windowMs:  60 * 1000,
    limit: 1000,
    message: { 
        
        message: "Too many requests from this IP. Please slow down! 🛑" 
    }
});
app.use('/api/', globalLimiter);


//specfic limitter
const speedClickLimiter = rateLimit({
    windowMs: 2000, // 2 seconds
    limit: 1,       // 1 action per 2 seconds
    message: { 
        message: " Action too frequent." 
    }
});

//singup/login limmiter
const singUpLoginLimiter = rateLimit({
    windowMs:5000,
    limit:2,
    message:{
        message:"wait a bit and try again"
    }
});

//validation middleware general purpose
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {return res.status(400).json({ 
        message: errors.array()[0].msg });}
    next();
};




app.post(`/api/signUp`,singUpLoginLimiter,async (req,res)=>{
    //register new player
    const {newPlayerName,newPlayerPassword} = req.body;
    if(!newPlayerName || !newPlayerPassword){
        return res.status(400).json({message:'playerName and playerPassword required!'});
    }
    //check valid password
    const passwordLengthValid = newPlayerPassword.length >= 6 && newPlayerPassword.length <= 12;
    const hasLetter = /[a-zA-Z]/.test(newPlayerPassword);

    if (!passwordLengthValid || !hasLetter) {
        return res.status(400).json({ 
            message: 'Password must be 6-12 characters long and contain at least one letter!' 
        });
    }

    //check valid playerName
    const playerNameValid = /^[a-zA-Z0-9_]{3,30}$/.test(newPlayerName);
    if(!playerNameValid){
        return res.status(400).json({message:'playerName must be 3-30 characters long and can only contain letters, numbers, and underscores!'});
    }

    //create new player
    try{
        const hashedPassword = await hashPassword(newPlayerPassword);


        const newPlayer = new Player({playerName:newPlayerName,playerPassword:hashedPassword});
        await newPlayer.save();
        return  res.status(201).json({message:'player created successfully!'});

    }catch(error){
        if(error.code===11000){
            return res.status(400).json({message:'playerName already exists!'});
        }else{
            return res.status(500).json({message:'unknown error'});
        }
    }
    

});
    
app.post(`/api/login`,singUpLoginLimiter,async (req,res)=>{
    const{existPlayerName,existPlayerPassword} = req.body;
    try{
        const loginPlayer = await Player.findOne({playerName:existPlayerName});
        if(!loginPlayer){
            return res.status(400).json({message:'invalid playerName!'});
        }
        const passwordIsCorrect = await verifyPassword(existPlayerPassword,loginPlayer.playerPassword);
        if(!passwordIsCorrect){
            return res.status(400).json({message:'invalid playerPassword'});
        }




        //regenrate and save are older callback based functions, 
        // wrap them in a Promise to use await
    
        await new Promise((resolve, reject) => {
            req.session.regenerate((err) => (err ? reject(err) : resolve()));
        });

        req.session.playerName = loginPlayer.playerName;

        // Use a Promise to make save "awaitable"
        await new Promise((resolve, reject) => {
            req.session.save((err) => (err ? reject(err) : resolve()));
        });

       
        console.log('Session saved:', req.session);
        // This only runs after the session is 100% saved.
        return res.status(200).json({ message: 'login successful!' });
        
        
        
    }catch(error){
        return res.status(500).json({message:'unknown error'});
    }


});



//test if data is there
/*
app.get('/api/profile', (req, res) => {
    // If the cookie was sent correctly, req.session.playerName will exist
    if (req.session.playerName) {
        return res.json({ 
            loggedIn: true, 
            playerName: req.session.playerName 
        });
    } else {
        return res.status(401).json({ loggedIn: false, message: "Not logged in" });
    }
});
*/
//end of test


app.get('/api/currentPlayer',(req,res)=>{

    if(req.session.playerName===undefined){
        return res.status(401).json({message:'not logged in'});
    }else{
        return res.status(200).json({message:`Welcome Back! ${req.session.playerName}`});
    }
});


app.get('/api/getUserCoins',async (req,res)=>{
    try {
        if (req.session.playerName===undefined) {
            
            return res.sendStatus(401); 
        }

        const thePlayer = await Player.findOne({ playerName: req.session.playerName });

        if (!thePlayer) {
            return res.status(404).json({ message: "Player not found" });
        }

        
        return res.status(200).json({ userCoins: thePlayer.speedCoins });
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
})




app.get('/api/towerShop', async(req,res)=>{
    try{
        if(req.session.playerName){
            const playerData = await Player.findOne({ playerName: req.session.playerName });
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
                }
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



app.post('/api/addTower',[
    speedClickLimiter, 
    body('purchasedTowerLevel').isInt({ min: 1, max: 10 }),
    validate
    ],async (req,res)=>{
    if(!req.session.playerName){
        return res.sendStatus(404);
    }
    const thePlayer = await Player.findOne({playerName:req.session.playerName});
    if(!thePlayer||!towerGameSetting){
        return res.sendStatus(404);
    }

    try{
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
                            towerGameSetting.towerLv10.cost
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
            default:break;

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


app.get('/api/getUserTowerCollection',async (req,res)=>{
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


app.post('/api/editTowerDeploy',[
    body('updatedDeploy').isArray({ min: 3, max: 3 }),
    body('updatedDeploy.*').isInt({ min: 0, max: 10 }),
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



app.get('/api/towerGame/getTowerDeploy',async (req,res)=>{
    if(!req.session.playerName){
        return res.sendStatus(404);
    }
    try{
        const thePlayer = await Player.findOne({playerName:req.session.playerName});
        if(!thePlayer||!towerGameSetting){
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
                                {...towerGameSetting.towerLv10}
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
                towerAngle:0

            });
        }
        return res.status(201).json(towerInitArr);









    }catch(error){
        return res.sendStatus(500);

    }
});

app.get('/api/towerGame/getEnemyAttribute',(req,res)=>{
    if(!req.session.playerName){
        return res.sendStatus(404);
    }
    try{
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

app.get('/api/towerGame/getCoinsAndScores',async (req,res)=>{
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




app.post('/api/towerGame/addCoins',[
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





app.post('/api/towerGame/updateScoreRecord',[
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












//finally the logout logic
app.post('/api/logout', (req, res) => {
    // Check if user is logged in
    if (!req.session.playerName) {
        return res.status(400).json({ message: 'Not logged in' });
    }

    const playerName = req.session.playerName;

    // Destroy the session
    req.session.destroy((err) => {
        if (err) {
            console.error('Session destruction error:', err);
            return res.status(500).json({ message: 'Logout failed' });
        }

        // Clear the session cookie
        res.clearCookie('connect.sid', {
            //for production
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // ADD THIS
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' // MATCH SESSION CONFIG
            //end of production block
        
        });

        console.log(`${playerName} logged out successfully`);
        return res.status(200).json({ message: 'Logged out successfully' });
    });
});






















//for production comment out this
//const PORT = process.env.PORT!==undefined ? process.env.PORT : 3000;
/*app.listen(PORT,()=>{
    console.log(`sever started on port ${PORT}`);
    
});*/


//for production
export default app;